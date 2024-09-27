import React from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({varient='info', children}) => {
  return <Alert variant={varient}> {children} </Alert>
};

export default Message;