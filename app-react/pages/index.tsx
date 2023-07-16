import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Divider, Layout } from "antd";
import type { NextPage } from "next";
import CardComponent from "../components/cards";
import { baseURI } from "../contract/VPNmarket";

const { Content } = Layout;

const Home: NextPage = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div
        style={{ marginLeft: "auto", marginRight: "20px", marginTop: "20px" }}
      >
        <ConnectButton />
      </div>
      <Divider />
      <Content>
        <CardComponent
          id={0}
          imageSrc={baseURI}
          price={1000000000000000}
          daysPeriod={30}
          isConnected={true}
        />
      </Content>
    </Layout>
  );
};

export default Home;
