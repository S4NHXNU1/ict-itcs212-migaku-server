CREATE DATABASE migaku;
USE migaku;
CREATE TABLE Users(
    userId INT AUTO_INCREMENT,
    username varchar(50),
    password varchar(100),
    email varchar(100),
    firstName varchar(100),
    lastName varchar(100),
    role enum('Teacher', 'User'),
   
    PRIMARY KEY (userId)
);

CREATE TABLE Student(
    userId INT,
    school varchar(100),
    eduLvl enum('High School', 'Undergraduate', 'Postgraduate'),
    
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE Teacher(
    userId INT,
    graduationDeg enum('B','M','PHD'),
    program varchar(100),
    major varchar(100),
    
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE Courses (
    courseId INT AUTO_INCREMENT,
    courseCode char(5),
    courseCat enum('SC','MA','IT','LG','SO'),
    courseName varchar(100),
    courseDes varchar(500),
    courseDuration INT,
    price DOUBLE,
    status BIT,
    rating enum('1','2','3','4','5'),
    teacherId INT,
    
    PRIMARY KEY (courseId),
    FOREIGN KEY (teacherId) REFERENCES Users(userId)
)