// src/components/MyTabs.js

import React from 'react';
import Tabs from '@theme/Tabs';

const valueToLabel = {
  "kotlin": "Kotlin",
  "typescript": "Typescript",
  "python": "Python",
  "swift": "Swift",
}

export function LanguageTabs({ children }) {
  const currValues = []
  React.Children.forEach(children, (x) => {
    const currValue = x.props.value
    const currLabel = valueToLabel[currValue]
    if (!!currLabel) {
      currValues.push ({ label: currLabel, value: currValue })
    } else throw Error(`Unexpected language tab: ${currValue}`)
  })
  return (
    <Tabs groupId="languagetabs" values={currValues}>
      {children}
    </Tabs>
  );
}
