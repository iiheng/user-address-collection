// 在App.js或其他组件文件中
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Cascader, message } from 'antd';

const Home = () => {
  const [addressOptions, setAddressOptions] = useState([]);
  const onFinish = (values) => {
    // Using fetch to send a POST request to the local server
    console.log("values",values)
    sendData(values)
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    const fetchData = async () => {
      // 首先尝试从localStorage中获取数据
      const storedData = localStorage.getItem('addressOptions');
      if (storedData) {
        setAddressOptions(JSON.parse(storedData));
      } else {
        try {
          const response = await fetch(`${process.env.PUBLIC_URL}/pca.json`);
          const data = await response.json();
          const transformedData = transformData(data);
          // 存储数据到localStorage以便下次使用
          localStorage.setItem('addressOptions', JSON.stringify(transformedData));
          setAddressOptions(transformedData);
        } catch (error) {
          console.error('Failed to fetch address data:', error);
        }
      }
    };
    fetchData();
  }, []);

  const sendData = (data) => {
    // 解构原始数据
    const [province, cityOrDistrict, districtProvided] = data.address;
    const city = districtProvided ? cityOrDistrict : province; // 如果提供了区县信息，则使用城市值，否则复制省份值到城市
    const district = districtProvided ? districtProvided : cityOrDistrict; // 如果提供了区县信息，则使用该值，否则使用城市/区的值

    const detailAddress = data.DetailAddress;
    const name = data.Name;
    const phone = data.Phone;
    const bankName = data.BankName;

    const requestBody = {
      address: [province, city, district], // 构建一个符合后端期望的三元素数组
      DetailAddress: detailAddress,
      Name: name,
      Phone: phone,
      BankName: bankName,
    };

// 使用requestBody作为请求体进行POST请求


// 使用requestBody作为请求体进行POST请求

  
    // 发送请求
    fetch('http://127.0.0.1:8787', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json()) // Assuming the server responds with JSON
    .then(data => message.success("上传成功")) // Handle the response data
    .catch(error => message.error(`上传失败,${error}`,1)); // Handle any errors
  };

  function transformData(originalData) {
    const transformedData = [];
  
    // 遍历原始数据的每个省份
    Object.keys(originalData).forEach((province) => {
      const provinceObj = {
        value: province,
        label: province,
        children: [],
      };
  
      // 遍历省份下的每个城市或直辖区
      Object.keys(originalData[province]).forEach((city) => {
        // 检查是否为"市辖区"或"县"，如果是，则直接使用下一级的区域作为子项
        if (city === "市辖区" || city === "县") {
          originalData[province][city].forEach((area) => {
            const areaObj = {
              value: area,
              label: area,
            };
            provinceObj.children.push(areaObj); // 将区域直接添加到省份的children数组中
          });
        } else {
          const cityObj = {
            value: city,
            label: city,
            children: [],
          };
  
          // 遍历城市下的每个区域
          originalData[province][city].forEach((area) => {
            const areaObj = {
              value: area,
              label: area,
            };
            cityObj.children.push(areaObj); // 将区域添加到城市的children数组中
          });
  
          provinceObj.children.push(cityObj); // 将城市添加到省份的children数组中
        }
      });
  
      transformedData.push(provinceObj); // 将省份对象添加到最终的转换数组中
    });
    return transformedData;
  }
  
  return (
    <Form
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="所在地区"
        name="address"
        rules={[{ required: true, message: '请选择您的所在地区!' }]}
      >
      <Cascader options={addressOptions} placeholder="请选择地址" />
      </Form.Item>
      
      <Form.Item
        label="详细地址"
        name="DetailAddress"
        rules={[{ required: true, message: '请输入详细地址!' }]} // 修改错误提示信息
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="收件人姓名"
        name="Name"
        rules={[{ required: true, message: '请输入收件人姓名!' }]} // 修改错误提示信息
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="收件人电话"
        name="Phone"
        rules={[
          { required: true, message: '请输入收件人电话!' }, // 原有的必填规则
          { // 添加的自定义校验规则
            validator: (_, value) => {
              const phoneRegex = /^1[3-9]\d{9}$/; // 简单的中国大陆手机号码正则表达式示例
              if (!value || phoneRegex.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('请输入有效的电话号码!'));
            }
          }
        ]}
      >
        <Input />
      </Form.Item>


      <Form.Item
        label="银行单位名称"
        name="BankName"
        rules={[{ required: true, message: '请输入银行单位名称!' }]} // 修改错误提示信息
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Home;
