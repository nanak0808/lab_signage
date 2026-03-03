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
      ) : category === "emergency_in_use" ? (
        <p className="schedule-time">
          一時的に使用中です．少しお待ちください．
        </p>
      ) : category === "emergency_away" ? (
        <p className="schedule-time">
          一時的に部屋を空けています．少しお待ちください．
        </p>
      ) : (
        <p className="schedule-time">
          {category}: {data.start_time} - {data.end_time}
        </p>
      )}
    </StyledSubInfo>
  );
}

export default SubInfo;
