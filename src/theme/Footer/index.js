import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import FooterLayout from '@theme/Footer/Layout';
function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) {
    return null;
  }
  const { style } = footer;
  return (
    <FooterLayout
      style={style}
    />
  );
}
export default React.memo(Footer);
