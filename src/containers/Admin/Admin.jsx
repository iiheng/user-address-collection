import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import './admin.css';

function Admin() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 使用fetch获取数据
    const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8787/');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          if (result && result.data && result.data.success) {
            setData(result.data.results); // 正确访问results数组
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
          // 处理错误情况
        }
      };
      

    fetchData();
  }, []); // 确保这个useEffect不会在组件更新时重新运行

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: '省份',
      dataIndex: 'Province',
      key: 'Province',
    },
    {
      title: '城市',
      dataIndex: 'City',
      key: 'City',
    },
    {
      title: '区',
      dataIndex: 'District',
      key: 'District',
    },
    {
      title: '详细地址',
      dataIndex: 'DetailAddress',
      key: 'DetailAddress',
    },
    {
      title: '姓名',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: '电话',
      dataIndex: 'Phone',
      key: 'Phone',
    },
    {
      title: '银行名称',
      dataIndex: 'BankName',
      key: 'BankName',
    },
    {
      title: '唯一标识符',
      dataIndex: 'UniqueIdentifier',
      key: 'UniqueIdentifier',
    },
  ];

  return (
    <div className="admin">
      <Table dataSource={data} columns={columns} rowKey="ID" />
    </div>
  );
}

export default Admin;
