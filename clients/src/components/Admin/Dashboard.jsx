import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect } from "react";
import BasicTable from "./Table";
import { Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import  Axios  from "axios";
import { useDispatch } from "react-redux";
import { AddJobs } from "../../redux/reducers/AllJobDetails";

const Dashboard = () => {
  const dispatch =useDispatch()
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Working")
    NetworkRequest();
  },[]);
  const NetworkRequest = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_SERVER_URL + "/admin/jobs"}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin")}`,
        },
      }
    );
    console.log(data.allJobs,"DASHBOARD")
    dispatch(AddJobs(data.allJobs));
  };



  return (
    <div>
      <Helmet>
        <title>CareerSheets-Admin</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://yt3.googleusercontent.com/JSKcgbOwC9er1na2B_jWU9OsNfouSfm_bs1CASylTw9cHZEycRixrqpJIMoNoU7QpEtPPTWxysw=s176-c-k-c0x00ffffff-no-rj"
        />
      </Helmet>
      <Container>
        <Box
          sx={{
            margin: "1rem",
            gap: "1rem",
          }}
        >
          <Button variant="contained" color="success" onClick={()=>navigate(-1)}>
          Go Back
        </Button>
          <Button
            variant="outlined"
            
            sx={{ margin: "0 1rem",color:"white",backgroundColor:"#11144C" }}
            onClick={() => navigate("/user")}
          >
            Goto User Dashboard
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ margin: "0 1rem" }}
            onClick={() => navigate("/admin/verify")}
          >
            Verify CollegeAdmin
          </Button>
          <Button variant="outlined" color="error">
            Download
          </Button>
          <Button
            sx={{ margin: "0 1rem" }}
            variant="outlined"
            color="error"
            onClick={() => navigate("/admin/new")}
          >
            New Job
          </Button>
          <Button
            sx={{ margin: "0 1rem" }}
            variant="outlined"
            color="error"
            onClick={() => navigate("/admin/jobs")}
          >
            View Jobs
          </Button>

          <Button
            sx={{ margin: "0 1rem" }}
            variant="outlined"
            color="error"
            onClick={() => navigate("/admin/lastseen")}
          >
            View Last Seen
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{ margin: "0 1rem" }}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Box>

        <Box
          sx={{
            minHeight: "80vh",
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Box>
            <Outlet />
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;
