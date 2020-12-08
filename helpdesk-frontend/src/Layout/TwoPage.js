import { Row, Col } from "antd";

const TwoPageLayout = ({ children, firstLayout: FirstLayout }) => {
  return (
    <Row>
      <Col xs={{ span: 12 }}>
        <FirstLayout />
      </Col>
      <Col xs={{ span: 12 }}>{children}</Col>
    </Row>
  );
};

export default TwoPageLayout;
