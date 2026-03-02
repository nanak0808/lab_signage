import styled from "@emotion/styled";

const StyledSubInfo = styled.div`
  margin-top: -1rem;
  font-size: 3.5vw;
  font-weight: bold;
  color: #ffffff;
  opacity: 0.8;
`;

function SubInfo({ data, category }) {
  return (
    <StyledSubInfo>
      {category === null ? (
        <p className="schedule-time">NOW VACANT</p>
      ) : category === "emergency" ? (
        <p className="schedule-time">EMERGENCY MODE</p>
      ) : (
        <p className="schedule-time">
          {category}: {data.start_time} - {data.end_time}
        </p>
      )}
      {/* {category != null ? (
        <p className="schedule-time">
          {category}: {data.start_time} - {data.end_time}
        </p>
      ) : (
        <p className="schedule-time">NOW VACANT</p>
      )} */}
    </StyledSubInfo>
  );
}

export default SubInfo;
