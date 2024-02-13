// 在App.js或其他组件文件中
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Cascader } from 'antd';

const Home = () => {
  const [addressOptions, setAddressOptions] = useState([]);
  const onFinish = (values) => {
    // console.log('Success:', values);
  
    // Using fetch to send a POST request to the local server
    fetch('http://127.0.0.1:8787', {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Set the content type header so the server knows to expect JSON
      },
      body: JSON.stringify(values), // Convert the JavaScript object to a JSON string
      
    })
    .then(response => {
      console.log("response",response)
      if (!response.ok) {
        // 如果服务器响应不是ok，即HTTP状态码不在200-299范围内，抛出错误
        throw new Error('Network response was not ok');
      }
      return response.json(); // 解析JSON响应并将其转换为JavaScript对象
    })
    .then(data => {
      console.log('Success:', JSON.stringify(data, null, 2)); // 使用JSON.stringify美化输出
    })
    .catch((error) => {
      console.error('Error:', error); // Handle any errors
    });
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/addresses.json');
        const data = await response.json();
        setAddressOptions(data);
      } catch (error) {
        console.error('Failed to fetch address data:', error);
      }
    };

    fetchData();
  }, []);
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
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="收件人姓名"
        name="Name"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="收件人电话"
        name="Phone"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="银行单位名称"
        name="BankName"
        rules={[{ required: true, message: 'Please input your password!' }]}
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
