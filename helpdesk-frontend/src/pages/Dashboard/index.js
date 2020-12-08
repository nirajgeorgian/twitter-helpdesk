import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import { Card, Row, Col, Typography, Avatar, Image, Input, Menu } from "antd";
import useFetch from "use-http";
import config from "../../config";

const { Text, Title } = Typography;
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [tweet, setTweet] = useState("");

  const { get, post, response, loading, error } = useFetch(
    `${config.apiUrl}/conversation`
  );

  useEffect(() => {
    const fetchConversation = async () => {
      const twitterData = await localStorage.getItem("example:twitter");
      if (twitterData) {
        const data = JSON.parse(twitterData);
        const { conversations: conversationsData } = await get(
          `/username/${data.screen_name}`
        );
        if (conversationsData) {
          const conversationData = await get(`/${conversationsData[0]._id}`);
          setConversation(conversationData);
          setConversations(conversationsData);
        }
      }
    };

    fetchConversation();
  }, []);

  const onSelectTweet = async (id) => {
    const conversationData = await get(`/${id}`);
    setConversation(conversationData);
  };

  const onUpdateTweet = async () => {
    const twitterData = await localStorage.getItem("example:twitter");
    if (twitterData) {
      const data = JSON.parse(twitterData);

      const tweetBody = {
        username: data.screen_name,
        comment: tweet,
        conversation_id: conversation.conversation._id,
      };

      const { status, reply } = await post(`/tweet/reply`, tweetBody);
      setConversation((conv) => ({
        ...conv,
        conversationBlocks: [...conv.conversationBlocks, reply],
      }));
    }
  };

  const tweetCard = (tweets) => {
    return tweets.map((tweet) => (
      <div
        style={{
          cursor: "pointer",
        }}
      ></div>
    ));
  };

  return (
    <Row>
      <Col md={6} lg={6} xl={6}>
        <div
          style={{
            height: "100vh",
            overflowY: "scroll",
            overflowX: "auto",
            cursor: "pointer",
          }}
        >
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                style={{
                  margin: "0.5rem",
                  border: "1px solid lightgrey",
                  padding: "0.5rem",
                  borderRadius: "5px",
                }}
                onClick={() => onSelectTweet(conv._id)}
              >
                <Row>
                  <Col span={4}>
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  </Col>
                  <Col span={20}>
                    <Title level={5}>{conv.twitterUser.screen_name}</Title>
                    <Text>{conv.conversation.slice(0, 50)}</Text>
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <Text>no data available ...</Text>
          )}
        </div>
      </Col>
      <Col md={18} lg={18} xl={18}>
        <Row style={{ height: "100vh" }}>
          <Col md={18} lg={18} xl={18}>
            {conversation && conversation.conversation ? (
              <div
                style={{
                  height: "100%",
                  padding: "1rem 0.5rem 0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "3px solid lightgrey",
                      }}
                    >
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>
                      <Title level={4}>
                        {conversation.conversation.twitterUser.screen_name}
                      </Title>
                    </div>
                    <Row style={{ margin: "1rem 0" }}>
                      <Col
                        md={3}
                        lg={3}
                        xl={3}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>
                      </Col>
                      <Col
                        md={21}
                        lg={21}
                        xl={21}
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <Text>
                          {dayjs(
                            conversation.conversation.createdDate
                          ).fromNow()}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={{ padding: "0.5rem, 0" }}>
                            {conversation.conversation.conversation}
                          </Text>
                          <Text>
                            {dayjs(
                              conversation.conversation.createdDate
                            ).format("LT")}
                          </Text>
                        </div>
                      </Col>
                    </Row>

                    {conversation.conversationBlocks.map((block) => (
                      <Row style={{ margin: "1rem 0" }}>
                        <Col
                          md={3}
                          lg={3}
                          xl={3}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></Avatar>
                        </Col>
                        <Col
                          md={21}
                          lg={21}
                          xl={21}
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ padding: "0.5rem, 0" }}>
                              {block.comment}
                            </Text>
                            <Text>{dayjs(block.createdDate).format("LT")}</Text>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </div>
                  <Input
                    onChange={({ target }) => setTweet(target.value)}
                    placeholder="enter your message to reply"
                    onPressEnter={onUpdateTweet}
                  />
                </div>
              </div>
            ) : (
              <Text>select or create a conversation to get start</Text>
            )}
          </Col>
          <Col md={6} lg={6} xl={6}>
            {conversation && conversation.conversation ? (
              <div
                style={{
                  padding: "3rem 0",
                  border: "1px solid lightgrey",
                  borderRadius: "5px",
                  margin: "0.5rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Row style={{ display: "flex", justifyContent: "center" }}>
                  <Col
                    md={18}
                    lg={18}
                    xl={18}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Avatar
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      size={{
                        xs: 24,
                        sm: 32,
                        md: 40,
                        lg: 64,
                        xl: 80,
                        xxl: 100,
                      }}
                    ></Avatar>
                  </Col>
                  <Col>
                    <Title level={4}>
                      {conversation.conversation.twitterUser.screen_name}
                    </Title>
                  </Col>
                </Row>
              </div>
            ) : (
              <Text>no data avilable</Text>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;
