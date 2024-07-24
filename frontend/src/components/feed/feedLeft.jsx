import React from 'react';

function LeftColumn() {
  const toggleAccordion = (id) => {
    const x = document.getElementById(id);
    if (x.className.indexOf("w3-show") === -1) {
      x.className += " w3-show";
      x.previousElementSibling.className += " w3-theme-d1";
    } else { 
      x.className = x.className.replace(" w3-show", "");
      x.previousElementSibling.className = 
      x.previousElementSibling.className.replace(" w3-theme-d1", "");
    }
  };

  return (
    <div className="w3-col m3">
      <div className="w3-card w3-round w3-white profile">
        <div className="w3-container">
          <h4 className="w3-center">My Profile</h4>
          <p className="w3-center"><img src="/w3images/avatar3.png" className="w3-circle" alt="Avatar" /></p>
          <hr />
          <p><i className="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> Designer, UI</p>
          <p><i className="fa fa-home fa-fw w3-margin-right w3-text-theme"></i> London, UK</p>
          <p><i className="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> April 1, 1988</p>
        </div>
      </div>
      <br />
      
      <div className="w3-card w3-round">
        <div className="w3-white">
          <button onClick={() => toggleAccordion('Demo1')} className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-circle-o-notch fa-fw w3-margin-right"></i> My Groups</button>
          <div id="Demo1" className="w3-hide w3-container">
            <p>Some text..</p>
          </div>
          <button onClick={() => toggleAccordion('Demo2')} className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-calendar-check-o fa-fw w3-margin-right"></i> My Events</button>
          <div id="Demo2" className="w3-hide w3-container">
            <p>Some other text..</p>
          </div>
          <button onClick={() => toggleAccordion('Demo3')} className="w3-button w3-block w3-theme-l1 w3-left-align"><i className="fa fa-users fa-fw w3-margin-right"></i> My Photos</button>
          <div id="Demo3" className="w3-hide w3-container">
            <div className="w3-row-padding">
              <br />
              <div className="w3-half">
                <img src="/w3images/lights.jpg" className="w3-margin-bottom" alt="Lights" />
              </div>
              <div className="w3-half">
                <img src="/w3images/nature.jpg" className="w3-margin-bottom" alt="Nature" />
              </div>
              <div className="w3-half">
                <img src="/w3images/mountains.jpg" className="w3-margin-bottom" alt="Mountains" />
              </div>
              <div className="w3-half">
                <img src="/w3images/forest.jpg" className="w3-margin-bottom" alt="Forest" />
              </div>
              <div className="w3-half">
                <img src="/w3images/nature.jpg" className="w3-margin-bottom" alt="Nature" />
              </div>
              <div className="w3-half">
                <img src="/w3images/snow.jpg" className="w3-margin-bottom" alt="Snow" />
              </div>
            </div>
          </div>
        </div>      
      </div>
      <br />
      
      <div className="w3-card w3-round w3-white w3-hide-small">
        <div className="w3-container">
          <p>Interests</p>
          <p>
            <span className="w3-tag w3-small w3-theme-d5">News</span>
            <span className="w3-tag w3-small w3-theme-d4">W3Schools</span>
            <span className="w3-tag w3-small w3-theme-d3">Labels</span>
            <span className="w3-tag w3-small w3-theme-d2">Games</span>
            <span className="w3-tag w3-small w3-theme-d1">Friends</span>
            <span className="w3-tag w3-small w3-theme">Games</span>
            <span className="w3-tag w3-small w3-theme-l1">Friends</span>
            <span className="w3-tag w3-small w3-theme-l2">Food</span>
            <span className="w3-tag w3-small w3-theme-l3">Design</span>
            <span className="w3-tag w3-small w3-theme-l4">Art</span>
            <span className="w3-tag w3-small w3-theme-l5">Photos</span>
          </p>
        </div>
      </div>
      <br />
      
      <div className="w3-card w3-round w3-white w3-padding-16 w3-center">
        <p>Ads</p>
      </div>
      <br />
      
      <div className="w3-card w3-round w3-white w3-padding-32 w3-center">
        <p><i className="fa fa-bug w3-xxlarge"></i></p>
      </div>
    </div>
  );
}

export default LeftColumn;
