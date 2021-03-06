import React, { useState } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';

const Form = styled.form`
  display: inline;
`;

export const Login: React.FC<{ isLogin: boolean; setIsLogin: Function }> = (props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleUserNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value);
  };
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const fetchUserInfo = (token: string) => {
    const method = 'GET';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: 'Bearer ' + token,
    };
    fetch('http://localhost:3000/me', { method, headers })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (json) {
        if (json.email) {
          props.setIsLogin(true);
          setEmail(json.email);
        }
      });
  };

  const logout = (e: React.FormEvent<HTMLFormElement>) => {
    Cookies.remove('token'); // クッキー削除
    props.setIsLogin(false);
  };
  //-------------------------
  // ログインリクエスト
  //-------------------------
  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = 'POST';
    const body = `email=${userName}&password=${password}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    };
    fetch('http://localhost:3000/login', { method, headers, body })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (json) {
        if (json.token) {
          Cookies.set('token', json.token);
          props.setIsLogin(true);
          fetchUserInfo(json.token);
        }
      });
  };

  const token = Cookies.get('token');
  if (token) {
    fetchUserInfo(token);
  }

  return (
    <div>
      {!props.isLogin && (
        <Form onSubmit={login}>
          <input type="text" value={userName} onChange={handleUserNameChange} />
          <input type="text" value={password} onChange={handlePasswordChange} />
          <button type="submit" name="login" className="btn btn-success">
            ログイン
          </button>
        </Form>
      )}
      {props.isLogin && (
        <div>
          <strong>ようこそ！{email}さん</strong>
          <Form onSubmit={logout}>
            <button type="submit" name="logout" className="btn btn-success">
              ログアウト
            </button>
          </Form>
        </div>
      )}
    </div>
  );
};
