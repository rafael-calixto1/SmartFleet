-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 10.100.100.122    Database: gerenciamento_de_frotas
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.6-MariaDB-0+deb12u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `car_maintenance_history`
--

DROP TABLE IF EXISTS `car_maintenance_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `car_maintenance_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `car_id` int(11) NOT NULL,
  `maintenance_type` varchar(255) NOT NULL,
  `maintenance_date` date NOT NULL,
  `maintenance_kilometers` decimal(10,2) NOT NULL,
  `observation` text DEFAULT NULL,
  `recurrency` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `car_maintenance_history_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `car_maintenance_history`
--

LOCK TABLES `car_maintenance_history` WRITE;
/*!40000 ALTER TABLE `car_maintenance_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `car_maintenance_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `make` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `current_kilometers` decimal(10,2) NOT NULL DEFAULT 0.00,
  `next_tire_change` int(11) DEFAULT NULL,
  `is_next_tire_change_bigger` tinyint(1) NOT NULL DEFAULT 0,
  `next_oil_change` int(11) DEFAULT NULL,
  `is_next_oil_change_bigger` tinyint(1) NOT NULL DEFAULT 0,
  `driver_id` int(11) DEFAULT NULL,
  `license_plate` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `cars_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (1,'FIAT','DOBLÔ',210192.00,248380,0,210000,1,6,'GOP1A40'),(2,'volkswagen','KOMBI',99500.00,110000,0,100000,0,10,'ENS8265'),(3,'FIAT','PÁLIO',64575.00,101000,0,65000,0,4,'EVV3G46'),(4,'FIAT','PÁLIO',141982.00,180000,0,145000,0,1,'DXH8E75'),(5,'FIAT','PÁLIO',212170.00,250000,0,215000,0,2,'OWJ5634'),(6,'FIAT','UNO VIVACE',103831.00,110000,0,105000,0,3,'PUG8E82'),(7,'FIAT','PÁLIO',82204.00,119915,0,85000,0,5,'FGH7G30'),(8,'FIAT','PÁLIO',63744.00,65000,0,65000,0,4,'EVV3G46'),(9,'FIAT','PÁLIO',152964.00,191000,0,15500,1,3,'HKV2C95');
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `license_number` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'ALTEMAR ARAUJO MATOS','05412912612'),(2,'PETERSON JESUS SILVA ','077981402289'),(3,'MARCOS ALEXANDRE ALEIXO DA SILVA','trocar'),(4,'LUIZ HENRIQUE MIRANDA MOREIRA','07596196534'),(5,'GIOVANE DOS SANTOS FERREIRA','trocar'),(6,'ELDAIR DOUGLAS DE FREITAS SOUZA','trocar'),(7,'DIOGO RODRIGUES DA SILVA','GGG7777'),(8,'DENIS FABIO NOGUEIRA','trocar'),(9,'JOELSON MENDES DA SILVA','trocar'),(10,'JOSE AIRTON DOS SANTOS BORGES','trocar');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fueling_history`
--

DROP TABLE IF EXISTS `fueling_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fueling_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `car_id` int(11) NOT NULL,
  `fuel_amount` decimal(10,2) NOT NULL,
  `fuel_date` date NOT NULL,
  `fueling_kilometers` decimal(10,2) NOT NULL,
  `liters_quantity` decimal(10,2) NOT NULL,
  `price_per_liter` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `fuel_type` varchar(255) NOT NULL,
  `observation` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `fueling_history_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fueling_history`
--

LOCK TABLES `fueling_history` WRITE;
/*!40000 ALTER TABLE `fueling_history` DISABLE KEYS */;
INSERT INTO `fueling_history` VALUES (1,1,242.08,'2025-01-06',208.71,42.55,5.69,242.08,'Gasoline',''),(2,2,176.77,'2025-01-07',98390.00,31.07,5.69,176.77,'Gasoline','ADITIVADA'),(3,3,135.05,'2025-01-04',62403.00,36.60,3.69,135.05,'Ethanol',''),(4,4,148.07,'2025-01-07',141453.00,40.13,3.69,148.07,'Ethanol',''),(5,4,161.05,'2024-12-30',141189.00,43.65,3.69,161.05,'Ethanol',''),(6,5,162.82,'2024-12-21',210824.00,44.13,3.69,162.82,'Ethanol',''),(7,7,128.73,'2024-12-30',80274.00,34.89,3.69,128.73,'Ethanol',''),(8,3,137.37,'2024-12-26',62140.00,37.23,3.69,137.37,'Ethanol',''),(9,7,213.67,'2024-12-23',80028.00,38.22,5.59,213.67,'Gasoline',''),(10,1,276.26,'2024-12-21',208383.00,48.55,5.69,276.26,'Gasoline',''),(11,6,159.69,'2025-01-10',103300.00,42.14,3.79,159.69,'Ethanol',''),(12,2,170.09,'2024-12-16',97975.00,29.89,5.69,170.09,'Gasoline',''),(13,4,233.15,'2024-12-17',140816.00,40.98,5.69,233.15,'Gasoline',''),(14,6,195.82,'2024-12-18',102673.00,34.42,5.69,195.82,'Gasoline',''),(15,2,177.51,'2024-12-28',98152.00,31.20,5.69,177.51,'Gasoline',''),(16,6,233.25,'2024-12-27',102951.00,40.99,5.69,233.25,'Gasoline',''),(17,5,229.75,'2024-12-31',211115.00,41.10,5.59,229.75,'Gasoline',''),(18,9,129.66,'2025-01-10',151883.00,34.21,3.79,129.66,'Ethanol',''),(19,4,165.60,'2025-01-14',141724.00,43.69,3.79,165.60,'Ethanol',''),(20,5,157.74,'2025-01-14',211455.00,41.62,3.79,157.74,'Ethanol',''),(21,3,146.44,'2025-01-15',62685.00,38.64,3.79,146.44,'Ethanol',''),(22,1,261.87,'2025-01-15',209083.00,45.23,5.79,261.87,'Gasoline',''),(23,9,133.58,'2025-01-17',152100.00,35.25,3.79,133.58,'Ethanol',''),(24,7,218.84,'2025-01-15',80898.00,38.46,5.69,218.84,'Gasoline',''),(25,2,206.33,'2025-01-16',96132.00,35.64,5.79,206.33,'Gasoline',''),(26,1,252.77,'2025-01-24',209461.00,43.66,5.79,252.77,'Gasoline',''),(27,6,168.39,'2025-01-24',103571.00,44.43,3.79,168.39,'Ethanol',''),(28,2,168.83,'2025-01-29',99048.00,29.16,5.79,168.83,'Gasoline',''),(29,2,160.20,'2025-02-03',99251.00,27.20,5.89,160.20,'Gasoline',''),(30,2,158.72,'2025-01-23',98864.00,27.41,5.79,158.72,'Gasoline',''),(31,4,237.71,'2025-01-22',141982.00,41.06,5.79,237.71,'Gasoline',''),(32,9,156.21,'2025-01-29',152420.00,40.16,3.89,156.21,'Ethanol',''),(33,3,214.56,'2025-01-23',62937.00,37.06,5.79,214.56,'Gasoline',''),(34,8,137.02,'2025-01-31',63225.00,35.22,3.89,137.02,'Ethanol',''),(35,5,154.91,'2025-01-22',211716.00,40.87,3.79,154.91,'Ethanol',''),(36,5,163.66,'2025-01-31',211969.00,42.07,3.89,163.66,'Ethanol',''),(37,7,145.34,'2025-01-22',81196.00,38.35,3.79,145.34,'Ethanol',''),(38,7,160.82,'2025-01-27',81419.00,41.34,3.89,160.82,'Ethanol',''),(39,7,223.29,'2025-01-31',81645.00,39.31,5.68,223.29,'Gasoline',''),(40,1,294.32,'2025-02-03',209852.00,49.97,5.89,294.32,'Gasoline',''),(41,1,281.22,'2025-02-13',210192.00,47.75,5.89,281.22,'Gasoline',''),(42,8,145.64,'2005-02-07',63496.00,36.50,3.99,145.64,'Ethanol',''),(43,8,146.67,'2025-02-14',63744.00,36.76,3.99,146.67,'Ethanol',''),(44,2,206.99,'2025-02-11',99500.00,35.14,5.89,206.99,'Gasoline',''),(45,3,157.16,'2025-03-06',64575.00,39.39,3.99,157.16,'Ethanol',''),(46,9,164.67,'2025-02-04',152706.00,41.27,3.99,164.67,'Ethanol',''),(47,9,154.22,'2025-02-11',152964.00,38.65,3.99,154.22,'Ethanol',''),(48,7,150.36,'2025-02-06',81924.00,37.69,3.99,150.36,'Ethanol',''),(49,7,156.18,'2025-02-12',82204.00,39.14,3.99,156.18,'Ethanol',''),(50,6,251.46,'2025-02-05',103831.00,42.69,5.89,251.46,'Gasoline',''),(51,5,232.43,'2025-02-07',212170.00,39.46,5.89,232.43,'Gasoline','');
/*!40000 ALTER TABLE `fueling_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oil_change_history`
--

DROP TABLE IF EXISTS `oil_change_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oil_change_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `car_id` int(11) NOT NULL,
  `oil_change_date` date NOT NULL,
  `liters_quantity` decimal(10,2) NOT NULL,
  `price_per_liter` decimal(10,2) NOT NULL,
  `total_cost` decimal(10,2) NOT NULL,
  `oil_change_kilometers` decimal(10,2) NOT NULL,
  `observation` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `oil_change_history_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oil_change_history`
--

LOCK TABLES `oil_change_history` WRITE;
/*!40000 ALTER TABLE `oil_change_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `oil_change_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tire_change_history`
--

DROP TABLE IF EXISTS `tire_change_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tire_change_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `car_id` int(11) NOT NULL,
  `tire_change_date` date NOT NULL,
  `tire_change_kilometers` decimal(10,2) NOT NULL,
  `observation` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `car_id` (`car_id`),
  CONSTRAINT `tire_change_history_ibfk_1` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tire_change_history`
--

LOCK TABLES `tire_change_history` WRITE;
/*!40000 ALTER TABLE `tire_change_history` DISABLE KEYS */;
INSERT INTO `tire_change_history` VALUES (1,9,'2024-12-10',151000.00,NULL),(2,5,'2024-12-10',210000.00,NULL),(3,4,'2024-12-15',140000.00,NULL),(4,1,'2024-12-15',208380.00,NULL),(5,7,'2024-12-20',79915.00,NULL),(6,3,'2025-01-13',61000.00,NULL);
/*!40000 ALTER TABLE `tire_change_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-08 18:39:04
