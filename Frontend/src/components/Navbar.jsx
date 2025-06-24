import React from 'react';
import { Layout, Avatar, Dropdown, Typography, Space,Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Header } = Layout;

const Navbar = ({ currentUser }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // default to dark

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const items = [
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Header style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#001529', padding: '0 20px' }}>
      <Typography.Title level={4} style={{ color: 'white', margin: 15 }}>
        ChatApp
      </Typography.Title>

      

      <Dropdown className='mx-5' menu={{ items }} placement="bottomRight">
        <Space style={{ cursor: 'pointer', color: 'white' }}>
          <Avatar style={{border:'1px solid blue'}} icon={<UserOutlined />} />
          <span>{currentUser}</span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default Navbar;
