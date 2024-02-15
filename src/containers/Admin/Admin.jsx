import React, { useEffect, useState } from 'react';
import { Table, Button ,Input,Modal,Select,message  } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
function Admin() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);


    //搜索功能
    const [searchConditions, setSearchConditions] = useState([
      { key: 'UID', values: [''] }, // 默认显示UID作为搜索条件
    ]);
  
    // 添加新的搜索条件
    const addSearchCondition = () => {
      const newCondition = { key: '', values: [''] };
      setSearchConditions([...searchConditions, newCondition]);
    };
  
    // 更新特定搜索条件的键或值
    const updateSearchCondition = (index, key, values) => {
      // 检查是否存在具有相同键的其他条件（排除当前正在更新的条件）
      const isDuplicateKey = searchConditions.some((condition, idx) => idx !== index && condition.key === key);

      if (isDuplicateKey) {
        message.error('该条件已存在，请选择其他条件或修改已有条件。', 1); // 显示时间为2.5
        return; // 提前返回以避免更新状态
      }

      const updatedConditions = [...searchConditions];
      updatedConditions[index] = { key, values };
      setSearchConditions(updatedConditions);
    };

    // 删除特定搜索条件
    const removeSearchCondition = index => {
      const updatedConditions = searchConditions.filter((_, i) => i !== index);
      setSearchConditions(updatedConditions);
    };
  
    // 使用useEffect钩子来更新筛选后的数据
    useEffect(() => {
      const result = data.filter(item =>
        searchConditions.every(condition =>
          condition.values.some(value =>
            item[condition.key]?.toString().includes(value)
          )
        )
      );
      setFilteredData(result);
    }, [data, searchConditions]); // 依赖项为data和searchConditions，它们变化时重新计算筛选后的数据


  useEffect(() => {
    // 使用fetch获取数据
    const fetchData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8787');
          // const response = await fetch('https://adddressapi.gptmanage.top/');
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
      title: '序号',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: 'ID',
      dataIndex: 'UID',
      key: 'UID',
      render: (text) => (
        <div>
          {text.length > 6 ? (
            <span>
              {`${text.substring(0, 6)}... `}
              <a onClick={() => Modal.info({
                title: '完整的UID',
                content: text,
              })}>查看更多</a>
            </span>
          ) : (
            <span>{text}</span>
          )}
        </div>
      ),
    },
    {
      title: '省份',
      dataIndex: 'Province',
      key: 'Province',
    },
    {
      title: '市县',
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
      dataIndex: 'UserName',
      key: 'UserName',
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
  
    // 处理数据：添加序号，修改列名，并合并省市区地址
    const processedData = data.map((item, index) => ({
      '序号': index + 1, // 添加序号
      'ID': item.UID, // 假设ID应该来自UID字段
      '省份': item.Province,
      '市县': item.City,
      '区': item.District,
      '地址': item.DetailAddress,
      '完整地址': `${item.Province}${item.City}${item.District}${item.DetailAddress}`, // 合并省市区详细地址
      '收件人': item.UserName,
      '电话': item.Phone,
      '银行名称': item.BankName,
      // 注意：创建时间现在放在了完整地址之后
      '创建时间': item.CreatedAt,
    }));

    // 使用处理后的数据创建工作表
    const ws = XLSX.utils.json_to_sheet(processedData);
  
    // 创建工作簿并添加工作表
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DataExport");
    // 导出Excel文件
    XLSX.writeFile(wb, fileName);
  };
  const exportFilteredToExcel = () => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    const fileName = `筛选后的地址数据${dateStr}_${timeStr}.xlsx`;
  
    // 使用筛选后的数据处理数据
    const processedData = filteredData.map((item, index) => ({
      '序号': index + 1, // 添加序号
      'ID': item.UID, // 假设ID应该来自UID字段
      '省份': item.Province,
      '市县': item.City,
      '区': item.District,
      '地址': item.DetailAddress,
      '完整地址': `${item.Province}${item.City}${item.District}${item.DetailAddress}`, // 合并省市区详细地址
      '收件人': item.UserName,
      '电话': item.Phone,
      '银行名称': item.BankName,
      '创建时间': item.CreatedAt,
    }));
  
    // 使用处理后的数据创建工作表
    const ws = XLSX.utils.json_to_sheet(processedData);
  
    // 创建工作簿并添加工作表
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredDataExport");
    // 导出Excel文件
    XLSX.writeFile(wb, fileName);
  };
  const paginationConfig = {
    pageSize: 10, // 每页显示15条记录
  };

  return (
    <div className="admin" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16 }}>
        {searchConditions.map((condition, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: 8, marginBottom: 8 }}>
            <Select
              value={condition.key}
              onChange={value => updateSearchCondition(index, value, condition.values)}
              style={{ width: 120, marginRight: 8 }}
            >
              {/* 使用中文标签并补充所有可能的搜索字段 */}
              <Select.Option value="UID">UID</Select.Option>
              <Select.Option value="Province">省份</Select.Option>
              <Select.Option value="City">市县</Select.Option>
              <Select.Option value="District">区</Select.Option>
              <Select.Option value="DetailAddress">详细地址</Select.Option>
              <Select.Option value="UserName">收件人</Select.Option>
              <Select.Option value="Phone">电话</Select.Option>
              <Select.Option value="BankName">银行名称</Select.Option>
              <Select.Option value="CreatedAt">创建时间</Select.Option>
            </Select>
            <Input
              placeholder="值，多个值用逗号分隔"
              value={condition.values.join(',')}
              onChange={e => updateSearchCondition(index, condition.key, e.target.value.split(',').map(v => v.trim()))}
              style={{ width: 180, marginRight: 8 }}
            />
            <Button type="danger" onClick={() => removeSearchCondition(index)} style={{ marginRight: 8 }}>
              删除
            </Button>
          </div>
        ))}
        <Button onClick={addSearchCondition} style={{ marginRight: 8 }}>
          添加筛选条件
        </Button>
        <Button type="primary" onClick={exportFilteredToExcel} style={{ marginRight: 8 }}>
          导出筛选后的Excel
        </Button>
        <Button type="primary" onClick={exportToExcel}>
          导出Excel
        </Button>
      </div>
      <Table dataSource={filteredData} columns={columns} rowKey="ID" />
    </div>
  );
};


export default Admin;
