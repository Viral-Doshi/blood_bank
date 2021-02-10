CREATE TABLE IF NOT EXISTS `people` (
  `PID` INTEGER AUTO_INCREMENT NOT NULL,
  `full_name` VARCHAR(50) NOT NULL,
  `phone_number` BIGINT NOT NULL,
  `blood_group` ENUM('A+','A-','AB+','AB-','B+','B-','O+','O-') NOT NULL,
  `DOB` DATE NOT NULL,
  `email` VARCHAR(50),
  `password` VARCHAR(100),
  `verified` BOOLEAN NOT NULL DEFAULT 0,
  `gender` ENUM('male','female','others') NOT NULL,
  `user_type` ENUM('admin','normal','data-entry') NOT NULL DEFAULT 'normal',
   PRIMARY KEY(`PID`),
   UNIQUE(`phone_number`)
)AUTO_INCREMENT = 1;


CREATE TABLE IF NOT EXISTS `donor` (
  `PID` INTEGER NOT NULL,
  `weight` DECIMAL(10,3) NOT NULL,
  `height` DECIMAL(10,3) NOT NULL,
  `next_donation_date` DATE,            -- can be changed to previous_donation date
  `previous_sms_date` TIMESTAMP,       -- DATE to TIMESTAMP
   PRIMARY KEY(`PID`),
   FOREIGN KEY(`PID`) REFERENCES `people`(`PID`)
   ON DELETE CASCADE ON UPDATE CASCADE
);

--  removed location attribute
CREATE TABLE IF NOT EXISTS `blood_donation_camp` (
  `BDCID` INTEGER AUTO_INCREMENT NOT NULL,
  `location` TINYTEXT,
  `lat` float(10,6) NOT NULL,
  `lon` float(10,6) NOT NULL,
  `camp_name` varchar(30) NOT NULL,
  `camp_start` DATE,
  `camp_end` DATE,
  `comments` TINYTEXT DEFAULT NULL,
   PRIMARY KEY(`BDCID`),
   UNIQUE(`camp_name`)
)AUTO_INCREMENT = 1;                    -- after inserting change the AUTO_INCREMENT value here


-- removed branch_location attribute
CREATE TABLE IF NOT EXISTS `blood_bank` (
  `BLID` INTEGER AUTO_INCREMENT NOT NULL,
  `branch_location` TINYTEXT,
  `lat` float(10,6) NOT NULL,
  `lon` float(10,6) NOT NULL,
  `branch_name` varchar(30) NOT NULL,
  `contact_number` INTEGER NOT NULL,
   PRIMARY KEY(`BLID`),
   UNIQUE(`branch_name`)
)AUTO_INCREMENT = 1;                    -- after inserting change the AUTO_INCREMENT value here



CREATE TABLE IF NOT EXISTS `blood_bag` (
  `BBID` INTEGER NOT NULL,
  `BLID` INTEGER,
  `status` ENUM('available', 'donated', 'discarded') NOT NULL DEFAULT 'available',
  `blood_group` ENUM('A+','A-','AB+','AB-','B+','B-','O+','O-') NOT NULL,
  `dis_reason` TINYTEXT,
   PRIMARY KEY(`BBID`),
   FOREIGN KEY(`BLID`) REFERENCES `blood_bank`(`BLID`) ON UPDATE CASCADE ON DELETE SET NULL
);


-- changed column name of blood test 1 2 3   doantion step
-- blood group removed.. use people.blood_group
CREATE TABLE IF NOT EXISTS `donation_record` (
  `DID` INTEGER AUTO_INCREMENT NOT NULL,
  `PID` INTEGER NOT NULL,
  `BDCID` INTEGER,
  `BLID` INTEGER,
  `BBID` INTEGER,
  `donation_date` DATE NOT NULL DEFAULT current_date(),
  `haemoglobin` BOOLEAN,
  `BP` BOOLEAN,
  `temp` BOOLEAN,
  `pulse` BOOLEAN,
  `donation_step` TINYINT NOT NULL DEFAULT 0,
   PRIMARY KEY(`DID`),
   FOREIGN KEY(`PID`) REFERENCES `people`(`PID`) ON UPDATE CASCADE,
   FOREIGN KEY(`BDCID`) REFERENCES `blood_donation_camp`(`BDCID`) ON UPDATE CASCADE,
   FOREIGN KEY(`BLID`) REFERENCES `blood_bank`(`BLID`) ON UPDATE CASCADE,
   FOREIGN KEY(`BBID`) REFERENCES `blood_bag`(`BBID`) ON UPDATE CASCADE ON DELETE CASCADE,
   UNIQUE(`BBID`)
)AUTO_INCREMENT = 1;


-- added recevier name, purpose column
CREATE TABLE IF NOT EXISTS `request` (
  `REID` INTEGER AUTO_INCREMENT NOT NULL,
  `receiver_name` VARCHAR(50) NOT NULL,
  `blood_group` VARCHAR(3) NOT NULL,
  `quantity` INTEGER NOT NULL,
  `PID` INTEGER NOT NULL,
  `accepted` BOOLEAN NOT NULL DEFAULT 0,
  `uploaded_file` TINYTEXT,
  `request_date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  `purpose` TINYTEXT NOT NULL,
   PRIMARY KEY(`REID`),
   FOREIGN KEY(`PID`) REFERENCES `people`(`PID`) ON UPDATE CASCADE
)AUTO_INCREMENT = 1;


CREATE TABLE IF NOT EXISTS `reveived_record` (
  `RID` INTEGER AUTO_INCREMENT NOT NULL,
  `REID` INTEGER NOT NULL,
  `received_date` DATE NOT NULL DEFAULT current_date(),
  `amount` INTEGER NOT NULL,
  `BBID` INTEGER NOT NULL,
   PRIMARY KEY(`RID`),
   FOREIGN KEY(`REID`) REFERENCES `request`(`REID`) ON UPDATE CASCADE,
   FOREIGN KEY(`BBID`) REFERENCES `blood_bag`(`BBID`) ON UPDATE CASCADE ON DELETE CASCADE
)AUTO_INCREMENT = 1;


CREATE TABLE IF NOT EXISTS `sms` (
  `SMSID` INTEGER AUTO_INCREMENT NOT NULL,
  `PID` INTEGER NOT NULL,
  `date` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  `type` ENUM('donated','accepted','rejected','card','others'),
   PRIMARY KEY(`SMSID`),
   FOREIGN KEY(`PID`) REFERENCES `people`(`PID`) ON UPDATE CASCADE ON DELETE CASCADE
)AUTO_INCREMENT = 1;
