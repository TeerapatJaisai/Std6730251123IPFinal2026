-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 20, 2026 at 08:37 AM
-- Server version: 8.0.46-0ubuntu0.24.04.4
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ip_std6730251123`
--

-- --------------------------------------------------------

--
-- Table structure for table `Teerapat_Employee`
--

CREATE TABLE `Teerapat_Employee` (
  `Teerapat_ID_Employee` int NOT NULL,
  `Teerapat_Name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Teerapat_Position` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Teerapat_Status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `Teerapat_Salary` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Teerapat_Employee`
--

INSERT INTO `Teerapat_Employee` (`Teerapat_ID_Employee`, `Teerapat_Name`, `Teerapat_Position`, `Teerapat_Status`, `Teerapat_Salary`) VALUES
(1, 'John Doe', 'Software Engineer', 'Active', 45000.00),
(2, 'Jane Smith', 'Product Manager', 'Active', 85000.00),
(3, 'Bob Johnson', 'UI/UX Designer', 'Active', 42000.00),
(4, 'Alice Brown', 'QA Engineer', 'Active', 38000.00),
(5, 'Charlie Wilson', 'DevOps Engineer', 'Active', 90000.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Teerapat_Employee`
--
ALTER TABLE `Teerapat_Employee`
  ADD PRIMARY KEY (`Teerapat_ID_Employee`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Teerapat_Employee`
--
ALTER TABLE `Teerapat_Employee`
  MODIFY `Teerapat_ID_Employee` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
