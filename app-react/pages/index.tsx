import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Divider, Layout } from "antd";
import type { NextPage } from "next";

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
      <Content></Content>
    </Layout>
  );
};

export default Home;
