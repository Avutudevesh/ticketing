import { useState, useEffect } from 'react';

const OrderShow = ({ order }) => {

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    }
    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);
    return (
      () => {
        clearInterval(timer);
      }
    );
  }, [order])
  if (timeLeft < 0) {
    return (
      <div>Order expired</div>
    );
  }
  return (
    <div>
      <h4>Time left to pay: {timeLeft} seconds</h4>
    </div>
  );
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
}

export default OrderShow;