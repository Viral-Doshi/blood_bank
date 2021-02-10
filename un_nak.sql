-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2021 at 12:04 PM
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
-- Database: `un_nak`
--

-- --------------------------------------------------------

--
-- Table structure for table `blood_bag`
--

CREATE TABLE `blood_bag` (
  `BBID` int(11) NOT NULL,
  `BLID` int(11) DEFAULT NULL,
  `available` tinyint(1) NOT NULL,
  `rejected` tinyint(1) NOT NULL,
  `donated` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `blood_bank`
--

CREATE TABLE `blood_bank` (
  `BLID` int(11) NOT NULL,
  `LID` int(11) DEFAULT NULL,
  `branch_name` varchar(20) NOT NULL,
  `contact_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `blood_donation_camp`
--

CREATE TABLE `blood_donation_camp` (
  `BDCID` int(11) NOT NULL,
  `LID` int(11) DEFAULT NULL,
  `camp_name` varchar(20) NOT NULL,
  `camp_start` date DEFAULT NULL,
  `camp_end` date DEFAULT NULL,
  `comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `donation_date` date NOT NULL,
  `blood_group` varchar(3) NOT NULL,
  `haemoglobin` tinyint(1) DEFAULT NULL,
  `BP` tinyint(1) DEFAULT NULL,
  `temp` tinyint(1) DEFAULT NULL,
  `pulse` tinyint(1) DEFAULT NULL,
  `donation_step` enum('0','1','2','3') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `donor`
--

CREATE TABLE `donor` (
  `PID` int(11) NOT NULL,
  `weight` decimal(10,3) NOT NULL,
  `height` decimal(10,3) NOT NULL,
  `next_donation_date` date DEFAULT NULL,
  `previous_sms_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `LID` int(11) NOT NULL,
  `location` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `people`
--

CREATE TABLE `people` (
  `PID` int(11) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `phone_number` int(11) NOT NULL,
  `blood_group` varchar(3) NOT NULL,
  `DOB` date NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `gender` enum('male','female') NOT NULL,
  `user_type` enum('admin','normal','data-entry') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `uploaded_file` text DEFAULT NULL,
  `request_date` timestamp NULL DEFAULT current_timestamp(),
  `purpose` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reveived_record`
--

CREATE TABLE `reveived_record` (
  `RID` int(11) NOT NULL,
  `REID` int(11) NOT NULL,
  `received_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount` int(11) NOT NULL,
  `BBID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  ADD UNIQUE KEY `branch_name` (`branch_name`),
  ADD KEY `LID` (`LID`);

--
-- Indexes for table `blood_donation_camp`
--
ALTER TABLE `blood_donation_camp`
  ADD PRIMARY KEY (`BDCID`),
  ADD UNIQUE KEY `camp_name` (`camp_name`),
  ADD KEY `LID` (`LID`);

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
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`LID`);

--
-- Indexes for table `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`PID`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`REID`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `reveived_record`
--
ALTER TABLE `reveived_record`
  ADD PRIMARY KEY (`RID`),
  ADD KEY `REID` (`REID`),
  ADD KEY `BBID` (`BBID`);

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
  MODIFY `BLID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blood_donation_camp`
--
ALTER TABLE `blood_donation_camp`
  MODIFY `BDCID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donation_record`
--
ALTER TABLE `donation_record`
  MODIFY `DID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `LID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `people`
--
ALTER TABLE `people`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `REID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reveived_record`
--
ALTER TABLE `reveived_record`
  MODIFY `RID` int(11) NOT NULL AUTO_INCREMENT;

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
-- Constraints for table `blood_bank`
--
ALTER TABLE `blood_bank`
  ADD CONSTRAINT `blood_bank_ibfk_1` FOREIGN KEY (`LID`) REFERENCES `location` (`LID`) ON UPDATE CASCADE;

--
-- Constraints for table `blood_donation_camp`
--
ALTER TABLE `blood_donation_camp`
  ADD CONSTRAINT `blood_donation_camp_ibfk_1` FOREIGN KEY (`LID`) REFERENCES `location` (`LID`) ON UPDATE CASCADE;

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
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `request_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `people` (`PID`) ON UPDATE CASCADE;

--
-- Constraints for table `reveived_record`
--
ALTER TABLE `reveived_record`
  ADD CONSTRAINT `reveived_record_ibfk_1` FOREIGN KEY (`REID`) REFERENCES `request` (`REID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reveived_record_ibfk_2` FOREIGN KEY (`BBID`) REFERENCES `blood_bag` (`BBID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sms`
--
ALTER TABLE `sms`
  ADD CONSTRAINT `sms_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `people` (`PID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
