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
      {data.start_time && data.start_time !== "none" && (
        <p className="schedule-time">
          {category}: {data.start_time} - {data.end_time}
        </p>
      )}
    </StyledSubInfo>
  );
}

export default SubInfo;
