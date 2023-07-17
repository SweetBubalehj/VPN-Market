import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Divider, Layout, Spin, Row, Col } from "antd";
import type { NextPage } from "next";
import CardComponent from "../components/cards";
import { baseURI } from "../contract/VPNmarket";
import { usePlanList } from "../utils/planList";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AlertComponent from "../components/planAlert";
import { usePlanEndTime } from "../utils/userPlanInfo";
import { useTimeRemaining } from "../utils/timeCalculation";
import Head from "next/head";

const { Content } = Layout;

const Home: NextPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { address: userAddress } = useAccount();
  const addressIsConnected = userAddress !== undefined;

  useEffect(() => {
    if (addressIsConnected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [addressIsConnected]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const plans = usePlanList();
  const PlanTimeEnd = useTimeRemaining(usePlanEndTime(userAddress));

  return isClient ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Head>
        <title>VPN Market</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <div
        style={{ marginLeft: "auto", marginRight: "20px", marginTop: "20px" }}
      >
        <ConnectButton />
      </div>
      <Divider />
      <Content>
        <div
          style={{
            margin: "0 auto",
            width: "50%",
            minWidth: "300px",
            marginBottom: "25px",
          }}
        >
          <AlertComponent isConnected={isConnected} endTime={PlanTimeEnd} />
        </div>
        {!plans ? (
          <Spin size="large" />
        ) : (
          <Row gutter={[16, 24]} justify="center">
            {plans?.map((plan, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
                <CardComponent
                  id={index}
                  imageSrc={baseURI}
                  price={plan.price}
                  daysPeriod={plan.period}
                  isConnected={isConnected}
                  isActive={PlanTimeEnd > 0}
                  userAddress={userAddress}
                />
              </Col>
            ))}
          </Row>
        )}
      </Content>
    </Layout>
  ) : null;
};

export default Home;
