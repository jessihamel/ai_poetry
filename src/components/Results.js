import React from 'react';
import EmotionGraph from './EmotionGraph';

export default class Results extends React.Component {
  render() {
    const results = Object.keys(this.props.results).map(result => {
      const poem = this.props.poems.find(poem => poem.slug === result)
      const emotions = this.props.results[result].emotions
      const analysis = this.props.results[result].analysis
      return (
        <div key={result} className='result'>
          <div className='header'>{poem.title} by {poem.author}</div>
          <div className='result-graph'>
            <div className='result-comparison'>
              <EmotionGraph emotions={emotions} size={100} showGraph={true} animate={false} />
              <div>You</div>
            </div>
            <div className='result-comparison'>
              <EmotionGraph emotions={analysis} size={100} showGraph={true} animate={false}/>
              <div>A.I.</div>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className='results'>
        {results}
      </div>
    );
  }
}
