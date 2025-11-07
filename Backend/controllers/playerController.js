// Backend/controllers/playerController.js
import Player from "../models/Player.js";
import Federation from "../models/Federation.js";


export const getPlayers = async (req, res) => {
  try {
    const { position, federationId, q } = req.query;
    const filter = {};

    if (position) filter.position = position;
    if (federationId) filter.federation = federationId;
    if (q) filter.name = { $regex: q, $options: "i" };

    const players = await Player.find(filter).populate("federation", "country");
    res.status(200).json(players);
  } catch (err) {
    console.error("getPlayers error:", err);
    res.status(500).json({ message: "Failed to fetch players", error: err.message });
  }
};


export const getTopPlayers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const position = req.query.position; 

    let pipeline = [];

    if (position) {
      // only players with that position and sort by ratings[position]
      pipeline.push(
        { $match: { position } },
        { $addFields: { sortRating: `$ratings.${position}` } },
        { $sort: { sortRating: -1 } },
        { $limit: limit }
      );
    } else {
      // compute naturalRating field = ratings[position] where position is the player's position
      pipeline.push(
        {
          $addFields: {
            naturalRating: {
              $switch: {
                branches: [
                  { case: { $eq: ["$position", "GK"] }, then: "$ratings.GK" },
                  { case: { $eq: ["$position", "DF"] }, then: "$ratings.DF" },
                  { case: { $eq: ["$position", "MD"] }, then: "$ratings.MD" },
                  { case: { $eq: ["$position", "AT"] }, then: "$ratings.AT" },
                ],
                default: 0,
              },
            },
          },
        },
        { $sort: { naturalRating: -1 } },
        { $limit: limit }
      );
    }

    pipeline.push(
      {
        $lookup: {
          from: "federations",
          localField: "federation",
          foreignField: "_id",
          as: "federation",
        },
      },
      { $unwind: { path: "$federation", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          position: 1,
          ratings: 1,
          isCaptain: 1,
          federation: { _id: "$federation._id", country: "$federation.country" },
          naturalRating: position ? `$ratings.${position}` : "$naturalRating",
        },
      }
    );

    const top = await Player.aggregate(pipeline);
    res.status(200).json(top);
  } catch (err) {
    console.error("getTopPlayers error:", err);
    res.status(500).json({ message: "Failed to fetch top players", error: err.message });
  }
};

/**
 * GET /api/federations/:id/players
 */
export const getPlayersByFederation = async (req, res) => {
  try {
    const { country } = req.params;

    // Find the federation by country name
    const federation = await Federation.findOne({ country });
    if (!federation) {
      return res.status(404).json({ message: `Federation ${country} not found` });
    }

    // Find all players linked to that federation
    const players = await Player.find({ federation: federation._id })
      .sort({ isCaptain: -1, name: 1 })
      .lean();

    if (!players.length) {
      return res.json([]);
    }

    res.status(200).json(players);
  } catch (err) {
    console.error("getPlayersByFederation error:", err);
    res.status(500).json({
      message: "Failed to fetch players for federation",
      error: err.message,
    });
  }
};

