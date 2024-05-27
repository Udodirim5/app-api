const express = require("express");

const nftControllers = require("./../controllers/nftsController");

const router = express.Router();

// TOP 5 NFTs BY PRICE
router
  .route("/top-5-nfts")
  .get(nftControllers.eliesTopNFTs, nftControllers.getAllNfts);

// NFTs STATS
router.route("/nfts-stats").get(nftControllers.getNftsStats);

// NFTs STATS
router.route("/monthly-plan/:year").get(nftControllers.getMonthlyPlan);

// GET MONTHLY PLAN
router.route("/").get(nftControllers.getAllNfts).post(nftControllers.createNft);

router
  .route("/:id")
  .get(nftControllers.getSingleNft)
  .patch(nftControllers.updateNft)
  .delete(nftControllers.deleteNft);

module.exports = router;
