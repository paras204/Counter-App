import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Network, Provider } from "aptos";

export const provider = new Provider(Network.DEVNET);
// change this to be your module account address
export const moduleAddress = "f0b766d2499d851e5b502753e0de0d7ff2c131acb87f6e042faf8d9b416e859d";

function App() {
  const [taskCounter, setTaskCounter] = useState<number>(0);
  const { account, signAndSubmitTransaction } = useWallet();
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

  const fetchList = async () => {
    if (!account) return [];
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::todolist::TodoList`,
      );
      setAccountHasList(true);
      // tasks table counter
      const taskCounter = (todoListResource as any).data.task_counter;
      setTaskCounter(taskCounter);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

  const increaseCounter = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submitted
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::TodoList::create_task`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      // Fetch and update the task counter
      await fetchList();
    } catch (error: any) {
      console.log("error", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [account?.address]);

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Task Counter App</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      <Spin spinning={transactionInProgress}>
        {!accountHasList ? (
          <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
            <Col span={8} offset={8}>
              {/* Round red button style */}
              <Button
                disabled={!account}
                block
                onClick={increaseCounter}
                type="primary"
                style={{
                 
                  backgroundColor: "#ff4d4f", // Red color
                  borderRadius: "100px", // Half of the height to make it round
                }}
              >
                Increase Counter
              </Button>
            </Col>
          </Row>
        ) : (
          <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
            <Col span={8} offset={8}>
              <Input.Group compact>
                <Input
                  placeholder="Task Counter"
                  size="large"
                  value={taskCounter}
                  disabled
                />
              </Input.Group>
            </Col>
          </Row>
        )}
      </Spin>
    </>
  );
}

export default App;
