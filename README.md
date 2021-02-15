# HEVSScheduleAPI

## Table of contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)
    - [Get classes](#get-classes)
    - [Get a class schedule](#get-class-schedule)
3. [Author](#author)
4. [License](#license)

## Introduction <a name="introduction"></a>

**The base API URL is the following : https://hevs-schedule-api.herokuapp.com/**

This API was created to facilitate the retrieval of class schedules from the HEVS school classes, this latter not having a public API to do this task.
It is a simple interface between the end user and the _http://apps.hevs.ch/untis/horaireintra.aspx_ web page which provides the data on the schedules of each class. 

## API Endpoints <a name="api-endpoints"></a>
All endpoints return JSON responses.

### Get classes <a name="get-classes"></a>
---
This endpoint returns an array of classes whose schedules can be retrieved.
Any other class which would not be present in the array cannot have its schedule retrieved.

- **URL**

  `GET /classes/`
  
- **URL Params**
 
  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200<br />
    **Content example:**
    ```json
    {
      "classes": [
        {
          "value": "1610",
          "text": "401_F"
        },
        {
          "value": "2100",
          "text": "402_F"
        },
        ...
      ]
    }
    ```
 
- **Error Response:**

  - **Code:** 500<br />
    **Content example:**
    ```json
    { "message" : "Internal server error" }
    ```

- **Sample Call:**

  ```javascript
    try {
        const response = await fetch("https://hevs-schedule-api.herokuapp.com/classes");
        const json = await response.json();
        console.log(json);
    } catch (err) {
        console.error(err);
    }
  ```

### Get a class schedule <a name="get-class-schedule"></a>
---
This endpoint returns an object representing the class schedule for a specific day or a whole week.

-  **URL**

   `GET /schedule/:class/[:date]`
   
   _Example : `GET /schedule/604_F/2021-02-22`_
  
-  **URL Params**

   **Required:**
 
   **:class** — A fetchable class _(see [Get classes](#get-classes))_
   
   **Optional:**
   
   **:date** — A date as a day _(`yyyy-mm-dd`)_ or as a week number _(`1 to 52`)_.

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content example (for a given day):**
    ```json
    {
      "date": "22.02.2021",
      "courses": [
        {
          "startTime": "08:30:00",
          "endTime": "10:00:00",
          "classes": [
            "604_F",
            "604_D"
          ],
          "teachers": [
            "Schumacher M"
          ],
          "location": "Bellevue 209",
          "courseTitle": "644-1 Mobile Developement"
        },
        {
          "startTime": "10:20:00",
          "endTime": "11:05:00",
          "classes": [
            "604_F",
            "604_D"
          ],
          "teachers": [
            "Schumacher M"
          ],
          "location": "Bellevue 209",
          "courseTitle": "644-1 Cloud "
        }
      ]
    }
    ```
    
  OR
  
  - **Code:** 200 <br />
    **Content example (for a given week):**
    ```json
    {
      "week": "8",
      "days": [
        {
          "date": "22.02.2021",
          "courses": [
            {
              "startTime": "08:30:00",
              "endTime": "10:00:00",
              "classes": [
                "604_F",
                "604_D"
              ],
              "teachers": [
                "Schumacher M"
              ],
              "location": "Bellevue 209",
              "courseTitle": "644-1 Mobile Developement"
            },
            {
              "startTime": "10:20:00",
              "endTime": "11:05:00",
              "classes": [
                "604_F",
                "604_D"
              ],
              "teachers": [
                "Schumacher M"
              ],
              "location": "Bellevue 209",
              "courseTitle": "644-1 Cloud "
            }
          ]
        },
        ...
      ]
    }
    ```
    
  OR
  
  - **Code:** 200 <br />
    **Content (if API call is valid but no schedule is found):**
    ```json
    { }
    ```
  
- **Error Response:**

  - **Code:** 404 <br />
    **Content example:**
    ```json
    { "message" : "Invalid date parameter '2021-02-32'" }
    ```
    
  OR
  
  - **Code:** 500 <br />
    **Content example:**
    ```json
    { "message" : "POST request to hevs site failed." }
    ```
  

- **Sample Call:**

  ```javascript
    // Get the 604_F class schedule for today
    try {
        const response = await fetch("https://hevs-schedule-api.herokuapp.com/schedule/604_F");
        const json = await response.json();
        console.log(json);
    } catch (err) {
        console.error(err);
    }
    
    // OR
    
    // Get the 604_F class schedule on the 2021-02-22
    try {
        const response = await fetch("https://hevs-schedule-api.herokuapp.com/schedule/604_F/2021-02-22");
        const json = await response.json();
        console.log(json);
    } catch (err) {
        console.error(err);
    }
    
    // OR
    
    // Get the 604_F class schedule for the 8th week
    try {
        const response = await fetch("https://hevs-schedule-api.herokuapp.com/schedule/604_F/8");
        const json = await response.json();
        console.log(json);
    } catch (err) {
        console.error(err);
    }
  ```

## Author <a name="author"></a>
<table>
   <tbody>
      <tr>
         <td align="center" valign="top" width="100%">
            <a href="https://github.com/d-roduit">
            <img src="https://github.com/d-roduit.png?s=75" width="75" height="75"><br />
            Daniel Roduit
            </a>
         </td>
      </tr>
   </tbody>
</table>


## License <a name="license"></a>
This project is licensed under the MIT License
