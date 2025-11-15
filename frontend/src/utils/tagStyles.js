import React from 'react';
import { IoFlowerOutline } from 'react-icons/io5';
import { GiLemon, GiWrappedSweet, GiPaperLantern, GiFruitBowl, GiCoolSpices } from 'react-icons/gi';
import { FaTree, FaLeaf } from 'react-icons/fa';

const tagStyles = {
  Floral: {
    icon: <IoFlowerOutline />,
    color: '#FCE7F3',
    textColor: '#831843',
  },
  Cítrico: {
    icon: <GiLemon />,
    color: '#FEF9C3',
    textColor: '#713F12',
  },
  Amaderado: {
    icon: <FaTree />,
    color: '#EADDD7',
    textColor: '#44403C',
  },
  Fresco: {
    icon: <FaLeaf />,
    color: '#D1FAE5',
    textColor: '#047857',
  },
  Dulce: {
    icon: <GiWrappedSweet />,
    color: '#FEE2E2',
    textColor: '#991B1B',
  },
  Oriental: {
    icon: <GiPaperLantern />,
    color: '#FFEDD5',
    textColor: '#9A3412',
  },
  Frutal: {
    icon: <GiFruitBowl />,
    color: '#FFE4E6',
    textColor: '#9F1239',
  },
  Especiado: {
    icon: <GiCoolSpices />,
    color: '#FAE8FF',
    textColor: '#701A75',
  },
  Default: {
    icon: null,
    color: '#E5E7EB',
    textColor: '#374151',
  },
};

export const getTagStyle = (tagName) => {
  const styleKey = Object.keys(tagStyles).find(key => tagName.toLowerCase().includes(key.toLowerCase()));
  return styleKey ? tagStyles[styleKey] : tagStyles.Default;
};
