-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2021 at 07:38 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `new_blood_bank_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blood_bag`
--

CREATE TABLE `blood_bag` (
  `BBID` int(11) NOT NULL,
  `BLID` int(11) DEFAULT NULL,
  `status` enum('available','donated','discarded') NOT NULL DEFAULT 'available',
  `blood_group` enum('A+','A-','AB+','AB-','B+','B-','O+','O-') NOT NULL,
  `dis_reason` tinytext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blood_bag`
--

INSERT INTO `blood_bag` (`BBID`, `BLID`, `status`, `blood_group`, `dis_reason`) VALUES
(4753, 1, 'available', 'B-', NULL),
(8884, 1, 'available', 'O-', NULL),
(17171, 1, 'donated', 'AB+', NULL),
(78878, 1, 'available', 'O-', NULL),
(85277, 1, 'donated', 'A+', NULL),
(97979, 1, 'available', 'O-', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `blood_bank`
--

CREATE TABLE `blood_bank` (
  `BLID` int(11) NOT NULL,
  `branch_location` tinytext DEFAULT NULL,
  `lat` float(10,6) DEFAULT NULL,
  `lon` float(10,6) DEFAULT NULL,
  `branch_name` varchar(30) NOT NULL,
  `contact_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blood_bank`
--

INSERT INTO `blood_bank` (`BLID`, `branch_location`, `lat`, `lon`, `branch_name`, `contact_number`) VALUES
(1, 'First Blood Bank Location a Long String with complete details', NULL, NULL, 'First Blood Bank', 21474836),
(2, 'START... New Location, Typed For Testing, Long Location details, ...END', NULL, NULL, 'Second Blood Bank', 48744788);

-- --------------------------------------------------------

--
-- Table structure for table `blood_donation_camp`
--

CREATE TABLE `blood_donation_camp` (
  `BDCID` int(11) NOT NULL,
  `location` tinytext DEFAULT NULL,
  `lat` float(10,6) NOT NULL,
  `lon` float(10,6) NOT NULL,
  `camp_name` varchar(30) NOT NULL,
  `camp_start` date DEFAULT NULL,
  `camp_end` date DEFAULT NULL,
  `comments` tinytext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `blood_donation_camp`
--

INSERT INTO `blood_donation_camp` (`BDCID`, `location`, `lat`, `lon`, `camp_name`, `camp_start`, `camp_end`, `comments`) VALUES
(1, 'Normal Location Road, near this place, around this location, some location ', 0.000000, 0.000000, 'New Camp First', '2021-02-01', '2021-02-28', 'first camp for blood donation'),
(2, 'long long location long long location long long location long long location long long location long long location long long location long long location', 0.000000, 0.000000, 'New Camp Second', '2021-02-04', '2021-02-17', 'long comment long comment long comment long comment long comment long comment long comment');

-- --------------------------------------------------------

--
-- Table structure for table `donation_record`
--

CREATE TABLE `donation_record` (
  `DID` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `BDCID` int(11) DEFAULT NULL,
  `BLID` int(11) DEFAULT NULL,
  `BBID` int(11) DEFAULT NULL,
  `donation_date` date NOT NULL DEFAULT curdate(),
  `haemoglobin` tinyint(1) DEFAULT NULL,
  `BP` tinyint(1) DEFAULT NULL,
  `temp` tinyint(1) DEFAULT NULL,
  `pulse` tinyint(1) DEFAULT NULL,
  `donation_step` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `donation_record`
--

INSERT INTO `donation_record` (`DID`, `PID`, `BDCID`, `BLID`, `BBID`, `donation_date`, `haemoglobin`, `BP`, `temp`, `pulse`, `donation_step`) VALUES
(1, 2, 1, NULL, 78878, '2021-02-12', 0, 0, 1, 0, 3),
(2, 1, 1, NULL, 17171, '2021-02-11', 1, 1, 1, 1, 3),
(3, 12, 2, NULL, NULL, '2021-02-11', 1, 1, 1, 1, 2),
(4, 13, 2, NULL, 97979, '2021-02-11', 1, 1, 1, 1, 3),
(5, 4, 2, NULL, 8884, '2021-02-11', 1, 1, 1, 1, 3),
(6, 14, 2, NULL, 85277, '2021-02-11', 1, 1, 1, 1, 3),
(7, 12, NULL, 2, 4753, '2021-02-13', 1, 0, 1, 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `donor`
--

CREATE TABLE `donor` (
  `PID` int(11) NOT NULL,
  `weight` decimal(10,3) NOT NULL,
  `height` decimal(10,3) NOT NULL,
  `next_donation_date` date DEFAULT NULL,
  `previous_sms_date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `donor`
--

INSERT INTO `donor` (`PID`, `weight`, `height`, `next_donation_date`, `previous_sms_date`) VALUES
(1, '75.390', '117.800', '2021-05-11', '2021-02-10 18:30:00'),
(2, '90.090', '150.040', '2021-05-11', '2021-02-10 18:30:00'),
(4, '75.450', '153.680', '2021-05-11', '2021-02-10 18:30:00'),
(12, '75.600', '143.390', '2021-05-13', '2021-02-12 18:30:00'),
(13, '66.930', '45.360', '2021-05-11', '2021-02-10 18:30:00'),
(14, '78.360', '56.360', '2021-05-11', '2021-02-10 18:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `people`
--

CREATE TABLE `people` (
  `PID` int(11) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `phone_number` bigint(20) NOT NULL,
  `blood_group` enum('A+','A-','AB+','AB-','B+','B-','O+','O-') NOT NULL,
  `DOB` date NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `gender` enum('male','female','others') NOT NULL,
  `user_type` enum('admin','normal','data-entry') NOT NULL DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `people`
--

INSERT INTO `people` (`PID`, `full_name`, `phone_number`, `blood_group`, `DOB`, `email`, `password`, `verified`, `gender`, `user_type`) VALUES
(1, 'Ankit Sharmaxx', 8003301320, 'O+', '2000-09-29', 'ankitsharma.rbt@gmail.com', '$2a$10$NjaKqgjax4NoOHgn8DduLucf6stckBQSzNzAZqnUlH7npWH3AJ4nO', 1, 'female', 'admin'),
(2, 'New Userref', 1122334455, 'A+', '2009-02-04', 'aa@aa.com', '$2a$10$AjvAJmQ2uwO52t554iDOpu0K1ckz.X3ZTzr.yKBtZKASqYQO3PJlC', 1, 'female', 'normal'),
(3, 'New Dataentry', 1234567890, 'O+', '2013-06-14', 'de@de.com', '$2a$10$xJOHkNf7Tb9gbCSK9tikHuJUG9QqaPQoYFb5STruL3zEyx0x52wUi', 1, 'male', 'data-entry'),
(4, 'New Admin', 7894561230, 'AB+', '2000-04-14', 'newad@no.com', '$2a$10$hM0VuVTz7Z80/Y2wRpdEYuRJow43g3eTRWm.CWm9fenuGD7yW0.MS', 1, 'male', 'admin'),
(12, 'sa sds asd dataentry', 1122334457, 'O+', '2000-06-15', 'rr@rr.com', 'no password', 0, 'male', 'normal'),
(13, 'dvdva dfv', 7788997777, 'O-', '2007-06-05', 'ww@ww.co', 'no password', 0, 'female', 'normal'),
(14, 'fffe rfgref', 5245245254, 'A+', '2009-02-02', 'wer@d.in', 'no password', 0, 'male', 'normal');

-- --------------------------------------------------------

--
-- Table structure for table `received_record`
--

CREATE TABLE `received_record` (
  `RID` int(11) NOT NULL,
  `REID` int(11) NOT NULL,
  `received_date` date NOT NULL DEFAULT curdate(),
  `amount` int(11) NOT NULL,
  `BBID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `received_record`
--

INSERT INTO `received_record` (`RID`, `REID`, `received_date`, `amount`, `BBID`) VALUES
(1, 1, '2021-02-13', 99, 17171),
(2, 1, '2021-02-13', 94, 85277);

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `REID` int(11) NOT NULL,
  `receiver_name` varchar(50) NOT NULL,
  `blood_group` varchar(3) NOT NULL,
  `quantity` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `accepted` tinyint(1) NOT NULL DEFAULT 0,
  `uploaded_file` tinytext DEFAULT NULL,
  `request_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `purpose` tinytext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `request`
--

INSERT INTO `request` (`REID`, `receiver_name`, `blood_group`, `quantity`, `PID`, `accepted`, `uploaded_file`, `request_date`, `purpose`) VALUES
(1, 'Nameof Patient', 'O+', 2, 2, 1, 'http://res.cloudinary.com/dhiiwabjw/image/upload/v1613200369/bkiv9jxdtcdfayglery8.jpg', '2021-02-13 07:12:51', 'Message for request.. TESTING');

-- --------------------------------------------------------

--
-- Table structure for table `sms`
--

CREATE TABLE `sms` (
  `SMSID` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` enum('donated','accepted','rejected','card','others') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood_bag`
--
ALTER TABLE `blood_bag`
  ADD PRIMARY KEY (`BBID`),
  ADD KEY `BLID` (`BLID`);

--
-- Indexes for table `blood_bank`
--
ALTER TABLE `blood_bank`
  ADD PRIMARY KEY (`BLID`),
  ADD UNIQUE KEY `branch_name` (`branch_name`);

--
-- Indexes for table `blood_donation_camp`
--
ALTER TABLE `blood_donation_camp`
  ADD PRIMARY KEY (`BDCID`),
  ADD UNIQUE KEY `camp_name` (`camp_name`);

--
-- Indexes for table `donation_record`
--
ALTER TABLE `donation_record`
  ADD PRIMARY KEY (`DID`),
  ADD UNIQUE KEY `BBID` (`BBID`),
  ADD KEY `PID` (`PID`),
  ADD KEY `BDCID` (`BDCID`),
  ADD KEY `BLID` (`BLID`);

--
-- Indexes for table `donor`
--
ALTER TABLE `donor`
  ADD PRIMARY KEY (`PID`);

--
-- Indexes for table `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`PID`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- Indexes for table `received_record`
--
ALTER TABLE `received_record`
  ADD PRIMARY KEY (`RID`),
  ADD KEY `REID` (`REID`),
  ADD KEY `BBID` (`BBID`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`REID`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `sms`
--
ALTER TABLE `sms`
  ADD PRIMARY KEY (`SMSID`),
  ADD KEY `PID` (`PID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blood_bank`
--
ALTER TABLE `blood_bank`
  MODIFY `BLID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blood_donation_camp`
--
ALTER TABLE `blood_donation_camp`
  MODIFY `BDCID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `donation_record`
--
ALTER TABLE `donation_record`
  MODIFY `DID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `people`
--
ALTER TABLE `people`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `received_record`
--
ALTER TABLE `received_record`
  MODIFY `RID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `REID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sms`
--
ALTER TABLE `sms`
  MODIFY `SMSID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blood_bag`
--
ALTER TABLE `blood_bag`
  ADD CONSTRAINT `blood_bag_ibfk_1` FOREIGN KEY (`BLID`) REFERENCES `blood_bank` (`BLID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donation_record`
--
ALTER TABLE `donation_record`
  ADD CONSTRAINT `donation_record_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `people` (`PID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `donation_record_ibfk_2` FOREIGN KEY (`BDCID`) REFERENCES `blood_donation_camp` (`BDCID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `donation_record_ibfk_3` FOREIGN KEY (`BLID`) REFERENCES `blood_bank` (`BLID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `donation_record_ibfk_4` FOREIGN KEY (`BBID`) REFERENCES `blood_bag` (`BBID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `donor`
--
ALTER TABLE `donor`
  ADD CONSTRAINT `donor_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `people` (`PID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `received_record`
--
ALTER TABLE `received_record`
  ADD CONSTRAINT `received_record_ibfk_1` FOREIGN KEY (`REID`) REFERENCES `request` (`REID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `received_record_ibfk_2` FOREIGN KEY (`BBID`) REFERENCES `blood_bag` (`BBID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `people` (`PID`) ON UPDATE CASCADE;

--
-- Constraints for table `sms`
--
ALTER TABLE `sms`
  ADD CONSTRAINT `sms_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `people` (`PID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
