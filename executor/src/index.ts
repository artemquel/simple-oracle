import { ethers } from "ethers";
import { config } from "./config";
import axios from "axios";
import jp from "jsonpath";
import { Oracle__factory } from "./typechain";

enum RequestMethod {
  GET,
  POST,
}

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcProviderUrl);
  const wallet = new ethers.Wallet(config.walletPrivateKey, provider);

  const oracle = Oracle__factory.connect(
    config.oracleContractAddress,
    provider
  );

  provider.once("block", () => {
    oracle.on(oracle.filters.TaskQueued(), async (taskId) => {
      const {
        request: { url, jsonPath, payload, method },
      } = await oracle.getTask(taskId);

      switch (method as RequestMethod) {
        case RequestMethod.GET:
        default:
          const { data } = await axios.get(url);
          await oracle
            .connect(wallet)
            .fulfill(taskId, jp.query(data, jsonPath)[0] as string);
          console.log(`Job #${taskId.toNumber()} completed`);
      }
    });
  });
})();
