import useFetch from "use-http";
import {
  Row,
  Col,
  Layout,
  Typography,
  Button,
  Spin,
  Form,
  Input,
  Checkbox,
} from "antd";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import TwitterLogin from "react-twitter-login";
import styled from "styled-components";
import config from "../../config";
import homepageArt from "../../assests/homepage-art.svg";
import { useState } from "react";

const { Header } = Layout;
const { Text, Title } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { consumerSecret, consumerKey } = config.twitter;

const HomepageBanner = styled.img`
  max-width: 100%;
  height: auto;
  padding: 2rem;
`;
const RowLayout = styled(Row)`
  height: 100vh;
`;
const ColumnLayout = styled(Col)`
  height: 100%;
  display: flex;
`;
const AppHeader = styled(Header)`
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 50px;
`;
const BannerWrapper = styled(ColumnLayout)`
  background: #1890ff;
`;
const ContentWrapper = styled(ColumnLayout)`
  flex-direction: column;
`;
const FormWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100% - 85px);
`;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Onboard = () => {
  const history = useHistory();
  const [twitterData, setTwitterData] = useState(null);
  const { post, response, loading, error } = useFetch(`${config.apiUrl}/auth`);

  const onFinish = async (values) => {
    const {
      oauth_token,
      oauth_token_secret,
      screen_name,
      user_id,
    } = twitterData;
    const { status, ...body } = await post("/signup", {
      username: screen_name,
      twitter: {
        oauth_token,
        oauth_token_secret,
        user_id,
      },
      ...values,
    });
    if (response.ok) {
      console.log("body: ", body);
      localStorage.setItem("example:twitter", JSON.stringify(twitterData));
      history.push("/dashboard");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const authHandler = async (err, data) => {
    if (err) {
      console.log("error occured");
      console.log(err);
    } else {
      const { oauth_token, oauth_token_secret, screen_name, user_id } = data;
      const { status } = await post("/validate", {
        username: screen_name,
        twitter: {
          oauth_token,
          oauth_token_secret,
          user_id,
        },
      });
      if (!status) {
        setTwitterData(data);
      } else {
        localStorage.setItem("example:twitter", JSON.stringify(data));
        history.push("/dashboard");
      }
    }
  };

  return (
    <Spin indicator={antIcon} spinning={loading}>
      <RowLayout>
        <BannerWrapper xs={{ span: 12 }}>
          <HomepageBanner src={homepageArt} alt="homepage" />
        </BannerWrapper>
        <ContentWrapper xs={{ span: 12 }}>
          <AppHeader>
            <div style={{ marginRight: 10 }}>
              <a href="#">OOOO</a>
            </div>
            <Text type="secondary">
              don't have an account? <Text type="primary">sign up</Text>
            </Text>
          </AppHeader>
          {twitterData ? (
            <FormWrapper>
              <Title>Just a few more information ...</Title>
              <Form
                {...layout}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="FirstName"
                  name="firstName"
                  rules={[{ required: true, message: "Your Firstname!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="LastName" name="lastName">
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Your Email!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </FormWrapper>
          ) : (
            <FormWrapper>
              <Title>Signin to Continue</Title>
              <TwitterLogin
                consumerKey={consumerKey}
                consumerSecret={consumerSecret}
                authCallback={authHandler}
              >
                <Button size="large" type="primary">
                  Login With Twitter
                </Button>
              </TwitterLogin>
            </FormWrapper>
          )}
        </ContentWrapper>
      </RowLayout>
    </Spin>
  );
};

export default Onboard;
