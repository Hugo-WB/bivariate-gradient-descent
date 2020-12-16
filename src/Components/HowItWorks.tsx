import React from 'react'
import { Header } from 'semantic-ui-react'

import "./HowItWorks.css"

interface Props {
  
}


const HowItWorks = (props: Props) => {
  return (
    <div className = "">
      <div id="howItWorks">
        <Header>How it works</Header>
        <div id="downArrow" />
      </div>
    </div>
  )
}

export default HowItWorks
