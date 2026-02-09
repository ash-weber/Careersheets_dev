import * as React from "react";
import classes from "./EducationForm.module.css";
import { useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

//////////////

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Autocomplete from "@mui/material/Autocomplete";
import { educationActions } from "../../../../redux/reducers/education-Data";
import { REACT_APP_SERVER_URL } from "../../../../config";

const degree = [
  { degree: "BE/B.Tech" },
  { degree: "MBA" },
  { degree: "ME" },
  { degree: "BCA" },
  { degree: "Diploma" },
  { degree: "BA" },
  { degree: "MA" },
  { degree: "ME/M.Tech" },
  { degree: "BSC" },
  { degree: "B.com" },
  { degree: "BBA" },
  { degree: "MCA" },
  { degree: "Others" },

];

const id = "64350344dfae173da0f0e127";

const EducationForm = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.value);
  const [enteredDegree, setEnteredDegree] = React.useState();
  const [enteredGraduated, setEnteredGraduated] = React.useState();
  const [enteredStream, setEnteredStream] = React.useState();
  const [enteredGraduationYear, setEnteredGraduationYear] = React.useState();
  const [error, setError] = React.useState(false);
  const [register, setRegister] = React.useState();
  const [collegeName, setCollegeName] = React.useState({
    collegeName: "",
    id: "",
  });
  const [existId, setExistId] = React.useState();

  const [educationData, setEducationData] = React.useState({
    collegeName: "",
    degree: "",
    id: "",
    graduated: "",
    graduationYear: "",
    registerNumber: "",
    existId: "",
  });

  ////college list////
  const collegeData = props.data;

  ///sorting the college list

  function compare(a, b) {
    if (a.name.trim() < b.name.trim()) {
      return -1;
    }
    if (a.name.trim() > b.name.trim()) {
      return 1;
    }
    return 0;
  }

  if (collegeData) {
    collegeData.sort(compare);
  }

  useEffect(() => {
    if (props.editdata) {
      const eduData = props.editdata;
      setEnteredDegree({ degree: eduData.degree });
      setEnteredGraduated(eduData.graduated || "");
      setEnteredStream(eduData.stream);
      setEnteredGraduationYear(eduData.graduationYear);
      setRegister(eduData.registerNumber);
      setCollegeName({ collegeName: eduData.collegeName, id: eduData._id });
      setExistId(eduData.id);
    }
  }, [props.editdata]);

  const postRequest = async () => {
    console.log(
      "posttt educatio",
      collegeName,
      enteredDegree,
      enteredGraduated,
      enteredGraduationYear,
      register,
      enteredStream,
      existId
    );
    const response = await axios
      .post(
        REACT_APP_SERVER_URL + "/user/profile/education",
        {
          college: collegeName.collegeName,
          degree: enteredDegree.degree,
          graduated: enteredGraduated,
          graduationYear: enteredGraduationYear,
          registerNumber: register,
          stream: enteredStream,
          id: existId,
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        dispatch(educationActions.eduError(error.response.data.message));
        console.log(error, "@post error");
      });
    const data = await response.data;

    return data;
  };

  const registerChangeHandler = (event) => {
    setRegister(event.target.value);
  };

  const collegeNameHandler = (event, values) => {
    setCollegeName({
      collegeName: values.name,
      id: values.id,
    });
  };

  ///////
  const degreeChange = (event, values) => {
    setEnteredDegree({
      degree: values.degree,
    });
  };
  const graduatedChange = (event) => {
    setEnteredGraduated(event.target.value);
  };
  const graduationYearChange = (event) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value !== "" || regex.test(event.target.value)) {
      setError(true);
    }
    if (event.target.value === "" || regex.test(event.target.value)) {
      setEnteredGraduationYear(event.target.value);
      setError(false);
    }
  };
  const streamChange = (event) => {
    setEnteredStream(event.target.value);
  };

  const educationFormSubmitHandler = (event) => {
    console.log("hadler");
    event.preventDefault();

    postRequest().then((data) => {
      if (props.onClose) {
        props.onClose();
      }

      const obj = {
        collegeName: data.edu.collegeName,
        degree: data.edu.degree,
        graduationYear: data.edu.graduationYear,
        graduated: data.edu.graduated,
        _id: data.edu._id,
        registerNumber: data.edu.registerNumber,
        stream: data.edu.stream,
      };

      if (props.editdata) {
        dispatch(educationActions.updateEducation({ ...obj }));
      } else {
        dispatch(educationActions.addEducation({ ...obj }));
      }
    });

    setEducationData({
      collegeName: collegeName.collegeName,
      degree: enteredDegree.degree,
      graduationYear: enteredGraduationYear,
      graduated: enteredGraduated,
      registerNumber: register,
    });
  };

  return (
    <React.Fragment>
      <form onSubmit={educationFormSubmitHandler}>
        <DialogTitle>{props.editdata ? "Edit Education" : "Add Education"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.editdata ? (
              <>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  name="collegeName"
                  options={collegeData}
                  getOptionLabel={(option) => option.name}
                  onChange={collegeNameHandler}
                  fullWidth
                  value={{
                    name: collegeName?.collegeName,
                    id: collegeName?.id,
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="College"
                      variant="standard"
                      name="collegeName"
                      fullWidth
                    />
                  )}
                />

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  name="degree"
                  options={degree}
                  getOptionLabel={(option) => option.degree}
                  onChange={degreeChange}
                  value={{ degree: enteredDegree?.degree }}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Degree"
                      variant="standard"
                      name="degree"
                      fullWidth
                    />
                  )}
                />
              </>
            ) : (
              <>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  name="collegeName"
                  options={collegeData}
                  getOptionLabel={(option) => option.name}
                  onChange={collegeNameHandler}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="College"
                      variant="standard"
                      name="collegeName"
                      fullWidth
                    />
                  )}
                />

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  name="degree"
                  options={degree}
                  getOptionLabel={(option) => option.degree}
                  onChange={degreeChange}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Degree"
                      variant="standard"
                      name="degree"
                      fullWidth
                    />
                  )}
                />
              </>
            )}

            <TextField
              name="stream"
              margin="dense"
              id="name"
              label="Stream"
              placeholder="Eg.Computer Science"
              type="text"
              fullWidth
              value={enteredStream}
              variant="standard"
              // sx={{ width: "35.5em" }}
              onChange={streamChange}
            />
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Graduated
              </FormLabel>
              <RadioGroup
                aria-labelledby="graduated"
                name="graduated"
                onChange={graduatedChange}
                value={enteredGraduated || ""}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            <TextField
              name="graduationYear"
              margin="dense"
              id="name"
              label="Graduation year"
              type="text"
              inputProps={{ maxLength: 4 }}
              fullWidth
              variant="standard"
              value={enteredGraduationYear}
              // sx={{ width: "35.5em" }}
              onChange={graduationYearChange}
            />
            {error && <p className={classes.error}>Enter a valid Year</p>}
            <TextField
              name="register"
              margin="dense"
              id="register"
              label="Register Number"
              type="text"
              inputProps={{ maxLength: 15 }}
              value={register}
              fullWidth
              variant="standard"
              // sx={{ width: "35.5em" }}
              onChange={registerChangeHandler}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="submit">{props.editdata ? "Update" : "Add"}</Button>
        </DialogActions>
      </form>
    </React.Fragment>
  );
};

export default EducationForm;
