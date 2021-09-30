import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Divider,
  InputNumber,
  Select,
  Typography,
  Tag,
  Space,
  PageHeader,
} from "antd";
import {
  DeleteRowOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UserDeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
// import { HStack, Button } from "@chakra-ui/react";

import { CenteredFrame } from "../components/layout";
import { Address, AddressInput } from "../components";
import dips from "../dips";
import { mainnetProvider, blockExplorer } from "../App";

export default function Home({ tx, readContracts, writeContracts, mainnetProvider, address }) {
  /***** Routes *****/
  const routeHistory = useHistory();
  const viewElection = record => {
    // console.log({ record });
    routeHistory.push("/vote/" + record.id);
  };

  const createElection = () => {
    routeHistory.push("/create");
  };

  /***** States *****/

  const [selectedQdip, setSelectedQdip] = useState("onChain");
  const [qdipHandler, setQdipHandler] = useState();
  const [electionsMap, setElectionsMap] = useState();
  const [tableDataLoading, setTableDataLoading] = useState(false);

  /***** Effects *****/

  useEffect(() => {
    if (readContracts) {
      if (readContracts.Diplomacy) {
        init();
      }
    }
  }, [readContracts, address]);

  useEffect(async () => {
    if (qdipHandler) {
      let electionsMap = await qdipHandler.getElections();
      setElectionsMap(electionsMap);
    }
  }, [qdipHandler]);

  /***** Methods *****/
  const init = async () => {
    setQdipHandler(dips[selectedQdip].handler(tx, readContracts, writeContracts, mainnetProvider, address));
  };

  /***** Render *****/

  const dateCol = () => {
    return {
      title: "Created",
      dataIndex: "created_date",
      key: "created_date",
      align: "center",
      width: 112,
    };
  };
  const nameCol = () => {
    return {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      render: name => <Typography.Text>{name}</Typography.Text>,
    };
  };
  const creatorCol = () => {
    return {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      align: "center",
      render: creator => (
        <>
          <Address address={creator} fontSize="14pt" ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
        </>
      ),
    };
  };
  const votedCol = () => {
    return {
      title: "№ Voted",
      dataIndex: "n_voted",
      key: "n_voted",
      align: "center",
      width: 100,
      render: p => (
        <Typography.Text>
          {p.n_voted} / {p.outOf}
        </Typography.Text>
      ),
    };
  };
  const statusCol = () => {
    return {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: status => (status ? <Tag color={"lime"}>open</Tag> : <Tag>closed</Tag>),
    };
  };
  const tagsCol = () => {
    return {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      align: "center",
      render: tags =>
        tags.map(r => {
          let color = "orange";
          if (r == "candidate") {
            color = "blue";
          }
          if (r === "voted") {
            color = "green";
          }
          return (
            <Tag color={color} key={r}>
              {r.toLowerCase()}
            </Tag>
          );
        }),
    };
  };
  const actionCol = () => {
    return {
      title: "Action",
      key: "action",
      align: "center",
      width: 100,
      render: (text, record, index) => (
        <>
          <Space size="middle">
            <Button type="link" icon={<LinkOutlined />} size="small" shape="round" onClick={() => viewElection(record)}>
              View
            </Button>
          </Space>
        </>
      ),
    };
  };
  const columns = [dateCol(), nameCol(), creatorCol(), votedCol(), tagsCol(), statusCol(), actionCol()];

  let table_state = {
    bordered: true,
    loading: tableDataLoading,
  };
  return (
    <CenteredFrame>
      <PageHeader
        ghost={false}
        title="Elections"
        extra={[
          <Button
            icon={<PlusOutlined />}
            type="primary"
            size="large"
            shape="round"
            style={{ margin: 4 }}
            onClick={createElection}
          >
            Create Election
          </Button>,
        ]}
      />
      {electionsMap && (
        <Table
          {...table_state}
          size="middle"
          dataSource={Array.from(electionsMap.values()).reverse()}
          columns={columns}
          pagination={false}
          scroll={{ y: 600 }}
          style={{ padding: 10, width: 1000 }}
        />
      )}
    </CenteredFrame>
  );
}