import { Layout } from "antd";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Onboard from "./Onboard";
import Dashboard from "./Dashboard";

const { Content } = Layout;

const AppLayout = styled(Layout)`
  widht: 100%;
  height: 100%;
  background-color: transparent;
`;

const Pages = () => {
  return (
    <AppLayout>
      <Content>
        <Switch>
          <Route path="/" exact component={Onboard} />
          <Route path="/dashboard" exact component={Dashboard} />
        </Switch>
      </Content>
    </AppLayout>
  );
};

export default Pages;
