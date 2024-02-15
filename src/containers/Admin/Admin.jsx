import React, { useEffect, useState } from 'react';
import { Table, Button ,Input} from 'antd';
import './admin.css';
import * as XLSX from 'xlsx';
function Admin() {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // 使用fetch获取数据
    const fetchData = async () => {
        try {
          const response = await fetch('https://adddressapi.gptmanage.top/');
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
  useEffect(() => {
    // 根据搜索文本过滤数据
    const filtered = data.filter(entry =>
      Object.values(entry).some(
        value => typeof value === 'string' && value.includes(searchText)
      )
    );
    setFilteredData(filtered);
  }, [searchText, data]);

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
  ];

  const exportToExcel = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    const fileName = `地址数据${dateStr}_${timeStr}.xlsx`;
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataExport");
    XLSX.writeFile(wb, fileName);
  };
  const paginationConfig = {
    pageSize: 10, // 每页显示15条记录
  };

  return (
    <div className="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="搜索..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <Button type="primary" onClick={exportToExcel}>
          导出Excel
        </Button>
      </div>
      <Table 
        dataSource={filteredData} 
        columns={columns} 
        rowKey="ID" 
      />
    </div>
  );
}

export default Admin;
