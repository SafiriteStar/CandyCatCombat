-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema cccdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cccdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cccdb` DEFAULT CHARACTER SET utf8 ;
USE `cccdb` ;

-- -----------------------------------------------------
-- Table `cccdb`.`game_state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`game_state` (
  `gst_id` INT(11) NOT NULL AUTO_INCREMENT,
  `gst_state` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`gst_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cccdb`.`game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`game` (
  `gm_id` INT(11) NOT NULL AUTO_INCREMENT,
  `gm_turn` INT(11) NOT NULL DEFAULT '1',
  `gm_state_id` INT(11) NOT NULL,
  PRIMARY KEY (`gm_id`),
  INDEX `game_fk_match_state` (`gm_state_id` ASC) VISIBLE,
  CONSTRAINT `game_fk_match_state`
    FOREIGN KEY (`gm_state_id`)
    REFERENCES `cccdb`.`game_state` (`gst_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cccdb`.`scoreboard_state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`scoreboard_state` (
  `sbs_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sbs_state` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`sbs_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cccdb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`user` (
  `usr_id` INT(11) NOT NULL AUTO_INCREMENT,
  `usr_name` VARCHAR(60) NOT NULL,
  `usr_pass` VARCHAR(200) NOT NULL,
  `usr_token` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`usr_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cccdb`.`user_game_state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`user_game_state` (
  `ugst_id` INT(11) NOT NULL AUTO_INCREMENT,
  `ugst_state` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`ugst_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cccdb`.`user_game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`user_game` (
  `ug_id` INT(11) NOT NULL AUTO_INCREMENT,
  `ug_order` INT(11) NULL DEFAULT NULL,
  `ug_user_id` INT(11) NOT NULL,
  `ug_game_id` INT(11) NOT NULL,
  `ug_state_id` INT(11) NOT NULL,
  PRIMARY KEY (`ug_id`),
  INDEX `user_game_fk_user` (`ug_user_id` ASC) VISIBLE,
  INDEX `user_game_fk_game` (`ug_game_id` ASC) VISIBLE,
  INDEX `user_game_fk_user_game_state` (`ug_state_id` ASC) VISIBLE,
  CONSTRAINT `user_game_fk_game`
    FOREIGN KEY (`ug_game_id`)
    REFERENCES `cccdb`.`game` (`gm_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_game_fk_user`
    FOREIGN KEY (`ug_user_id`)
    REFERENCES `cccdb`.`user` (`usr_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_game_fk_user_game_state`
    FOREIGN KEY (`ug_state_id`)
    REFERENCES `cccdb`.`user_game_state` (`ugst_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cccdb`.`scoreboard`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`scoreboard` (
  `sb_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sb_user_game_id` INT(11) NOT NULL,
  `sb_state_id` INT(11) NOT NULL,
  `sb_points` INT(11) NOT NULL,
  PRIMARY KEY (`sb_id`),
  INDEX `scoreboard_fk_user_game` (`sb_user_game_id` ASC) VISIBLE,
  INDEX `scoreboard_fk_scoreboard_state` (`sb_state_id` ASC) VISIBLE,
  CONSTRAINT `scoreboard_fk_scoreboard_state`
    FOREIGN KEY (`sb_state_id`)
    REFERENCES `cccdb`.`scoreboard_state` (`sbs_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `scoreboard_fk_user_game`
    FOREIGN KEY (`sb_user_game_id`)
    REFERENCES `cccdb`.`user_game` (`ug_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `cccdb`.`character`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`character` (
  `char_id` INT NOT NULL AUTO_INCREMENT,
  `char_max_health` INT NOT NULL,
  `char_damage` INT NOT NULL,
  `char_defense` INT NOT NULL,
  `char_speed` INT NOT NULL,
  `char_range` INT NOT NULL,
  `char_cost` INT NOT NULL,
  PRIMARY KEY (`char_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`team`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`team` (
  `tm_id` INT NOT NULL AUTO_INCREMENT,
  `tm_user_id` INT(11) NOT NULL,
  `tm_selected` TINYINT NULL,
  PRIMARY KEY (`tm_id`),
  INDEX `fk_menu_team_user1_idx` (`tm_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_menu_team_user1`
    FOREIGN KEY (`tm_user_id`)
    REFERENCES `cccdb`.`user` (`usr_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`team_character`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`team_character` (
  `mtc_id` INT NOT NULL AUTO_INCREMENT,
  `mtc_char_id` INT NOT NULL,
  `mtc_team_id` INT NOT NULL,
  PRIMARY KEY (`mtc_id`),
  INDEX `fk_menu_team_character_character1_idx` (`mtc_char_id` ASC) VISIBLE,
  INDEX `fk_menu_team_character_menu_team1_idx` (`mtc_team_id` ASC) VISIBLE,
  CONSTRAINT `fk_menu_team_character_character1`
    FOREIGN KEY (`mtc_char_id`)
    REFERENCES `cccdb`.`character` (`char_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_menu_team_character_menu_team1`
    FOREIGN KEY (`mtc_team_id`)
    REFERENCES `cccdb`.`team` (`tm_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`game_character_state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`game_character_state` (
  `gcs_id` INT NOT NULL AUTO_INCREMENT,
  `gcs_state` VARCHAR(60) NULL,
  PRIMARY KEY (`gcs_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`game_team`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`game_team` (
  `gt_id` INT NOT NULL AUTO_INCREMENT,
  `gt_gtc_id` INT(11) NOT NULL,
  PRIMARY KEY (`gt_id`),
  INDEX `fk_game_team_game1_idx` (`gt_gtc_id` ASC) VISIBLE,
  CONSTRAINT `fk_game_team_game1`
    FOREIGN KEY (`gt_gtc_id`)
    REFERENCES `cccdb`.`game` (`gm_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`game_team_character`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`game_team_character` (
  `gtc_id` INT NOT NULL AUTO_INCREMENT,
  `gtc_game_team_id` INT NOT NULL,
  `gtc_type` INT NOT NULL,
  `gtc_current_health` INT NOT NULL,
  `gtc_stamina` INT NOT NULL,
  `gtc_state_id` INT NOT NULL,
  PRIMARY KEY (`gtc_id`),
  INDEX `fk_game_team_character_game_character_state1_idx` (`gtc_state_id` ASC) VISIBLE,
  INDEX `fk_game_team_character_game_team1_idx` (`gtc_game_team_id` ASC) VISIBLE,
  INDEX `fk_game_team_character_character1_idx` (`gtc_type` ASC) VISIBLE,
  CONSTRAINT `fk_game_team_character_game_character_state1`
    FOREIGN KEY (`gtc_state_id`)
    REFERENCES `cccdb`.`game_character_state` (`gcs_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_game_team_character_game_team1`
    FOREIGN KEY (`gtc_game_team_id`)
    REFERENCES `cccdb`.`game_team` (`gt_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_game_team_character_character1`
    FOREIGN KEY (`gtc_type`)
    REFERENCES `cccdb`.`character` (`char_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`board`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`board` (
  `brd_id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`brd_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`tile_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`tile_type` (
  `tty_id` INT NOT NULL AUTO_INCREMENT,
  `tty_type` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`tty_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`tile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`tile` (
  `tile_id` INT NOT NULL AUTO_INCREMENT,
  `tile_x` INT NOT NULL,
  `tile_y` INT NOT NULL,
  `tile_type_id` INT NOT NULL,
  `board_brd_id` INT NOT NULL,
  PRIMARY KEY (`tile_id`),
  INDEX `fk_tile_tile_type1_idx` (`tile_type_id` ASC) VISIBLE,
  INDEX `fk_tile_board1_idx` (`board_brd_id` ASC) VISIBLE,
  CONSTRAINT `fk_tile_tile_type1`
    FOREIGN KEY (`tile_type_id`)
    REFERENCES `cccdb`.`tile_type` (`tty_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tile_board1`
    FOREIGN KEY (`board_brd_id`)
    REFERENCES `cccdb`.`board` (`brd_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cccdb`.`game_tile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cccdb`.`game_tile` (
  `gbt_id` INT NOT NULL AUTO_INCREMENT,
  `gbt_game_id` INT(11) NOT NULL,
  `gbt_tile_id` INT NOT NULL,
  `gbt_char_id` INT NULL,
  PRIMARY KEY (`gbt_id`),
  INDEX `fk_game_board_tile_game1_idx` (`gbt_game_id` ASC) VISIBLE,
  INDEX `fk_game_tile_tile1_idx` (`gbt_tile_id` ASC) VISIBLE,
  INDEX `fk_game_tile_game_team_character1_idx` (`gbt_char_id` ASC) VISIBLE,
  CONSTRAINT `fk_game_board_tile_game1`
    FOREIGN KEY (`gbt_game_id`)
    REFERENCES `cccdb`.`game` (`gm_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_game_tile_tile1`
    FOREIGN KEY (`gbt_tile_id`)
    REFERENCES `cccdb`.`tile` (`tile_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_game_tile_game_team_character1`
    FOREIGN KEY (`gbt_char_id`)
    REFERENCES `cccdb`.`game_team_character` (`gtc_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
