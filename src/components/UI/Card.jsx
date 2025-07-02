import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'p-6',
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-card border border-gray-100 ${padding} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;