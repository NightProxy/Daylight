import React from 'react';
import "../../index.css"
const Clock = ({ isDesktop}) => {
  // Check if "cloakEnabled" is true in localStorage
  const clockEnabled = localStorage.getItem("clockEnabled") === 'true';

  // Render the component only if both conditions are true
  if (!isDesktop || !clockEnabled) {
    return null; // or return <></> for an empty fragment
  }
  React.useEffect(() => {
    Array.from(document.getElementsByClassName('os-scrollbar') as HTMLCollectionOf<HTMLElement>).forEach(element => {
      element.style.transition = ''
      element.style.opacity = ""

    });
    const secondHand = document.querySelector('.clock-times__second') as HTMLDivElement;
    const minsHand = document.querySelector('.clock-times__minute') as HTMLDivElement;
    const hourHand = document.querySelector('.clock-times__hour') as HTMLDivElement;

    function setDate() {
      const now = new Date();

      const seconds = now.getSeconds();
      const secondsDegrees = 6 * seconds;
      if (secondHand) {
        if (secondsDegrees === 0) {
          secondHand.setAttribute("style", `transition: all 0s ease; transform: rotate(${secondsDegrees}deg)`);
        } else {
          secondHand.setAttribute("style", `transition: transform 0.3s ease; transform: rotate(${secondsDegrees}deg)`);
        }
      }

      const mins = now.getMinutes();
      const minsDegrees = 6 * mins;
      if (minsHand) {
        minsHand.style.transform = `rotate(${minsDegrees}deg)`;
      }

      const hour = now.getHours() % 12;
      const hourDegrees = 30 * hour + mins / 2;
      if (hourHand) {
        hourHand.style.transform = `rotate(${hourDegrees}deg)`;
      }
    }

    const intervalId = setInterval(setDate, 1000);
    setDate();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="wrapper" id="clockfr">
      <div className="clock-container">
        <div className="clock">
          <div className="clock-circles">
            <div className="clock-circles__item"></div>
            <div className="clock-circles__item"></div>
            <div className="clock-circles__item"></div>
            <div className="clock-circles__item"></div>
          </div>
          <div className="clock-indicators">
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
            <div className="clock-indicators__item"></div>
          </div>
          <div className="clock-times">
            <div className="clock-times__second"></div>
            <div className="clock-times__minute"></div>
            <div className="clock-times__hour"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
