import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const Card: React.FC<Props> = ({ children }) => (
  <div className="card">{children}</div>
);

export default Card;
