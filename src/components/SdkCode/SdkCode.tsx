import React from "react";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { usePrismTheme } from '@docusaurus/theme-common';

const allowedLanguages = new Set([
  "Kotlin",
  "Python"
])

const SdkCode = ({ children }) => {
  const values = []

  React.Children.forEach(children, child => {
    const type = child.props.mdxType
    if (!allowedLanguages.has(type)) throw Error(`Invalid language ${type}`)
    values.push({ label: type, value: type.toLowerCase()})
  });

  const theme = usePrismTheme()

  return (
    <Tabs
      groupId="sdkdoc"
      values={values}
    >{
        React.Children.map(children, child => {
          const type = child.props.mdxType.toLowerCase()
          console.log(child)
          return <TabItem value={type}>
            <Highlight {...defaultProps} theme={theme} code={child.props.children} language={type}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div {...getLineProps({ line, key: i })}>
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </TabItem>
        })
    }</Tabs>
  );
};

export default SdkCode
