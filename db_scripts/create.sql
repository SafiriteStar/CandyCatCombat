create database ccatcdb;

use ccatcdb;

create table user (
    usr_id int not null auto_increment,
    usr_name varchar(60) not null,
    usr_pass varchar(200) not null, 
    usr_token varchar(200),
    primary key (usr_id));

create table game (
    gm_id int not null auto_increment,
    gm_board_id int not null default 2,
    gm_turn int not null default 1,
    gm_state_id int not null,
    primary key (gm_id));

create table game_state (
    gst_id int not null auto_increment,
    gst_state varchar(60) not null,
    primary key (gst_id));

create table user_game (
    ug_id int not null auto_increment,
    ug_order int,
    ug_user_id int not null,
    ug_game_id int not null,
    ug_state_id int not null,
    primary key (ug_id));

create table user_game_state (
    ugst_id int not null auto_increment,
    ugst_state varchar(60) not null,
    primary key (ugst_id));

create table scoreboard (
    sb_id int not null auto_increment,
    sb_user_game_id int not null,
    sb_state_id int not null,
    sb_points int not null default 0,
    primary key (sb_id));

create table testTable(
    ttt_id int not null auto_increment,
    ttt_useless int not null,
    primary key (ttt_id));

create table scoreboard_state (
    sbs_id int not null auto_increment,
    sbs_state varchar(60) not null,
    primary key (sbs_id));

create table team (
    tm_id int not null auto_increment,
    tm_user_id int not null,
    tm_selected BOOLEAN not null,
    primary key (tm_id));

create table team_cat (
    tmc_id int not null auto_increment,
    tmc_cat_id int not null,
    tmc_team_id int not null,
    primary key (tmc_id));

create table cat (
    cat_id int not null auto_increment,
    cat_name varchar(60) not null,
    cat_max_health int not null,
    cat_damage int not null,
    cat_defense int not null,
    cat_speed int not null,
    cat_min_range int not null,
    cat_max_range int not null,
    cat_cost int not null,
    primary key (cat_id));

create table game_team_cat (
    gtc_id int not null auto_increment,
    gtc_game_team_id int not null,
    gtc_x int not null,
    gtc_y int not null,
    gtc_game_board_id int not null,
    gtc_type_id int not null,
    gtc_current_health int not null,
    gtc_stamina int not null,
    gtc_state_id int not null default 1,
    primary key (gtc_id));

create table game_cat_state (
    gcs_id int not null auto_increment,
    gcs_state varchar(60) not null,
    primary key (gcs_id));

create table game_team (
    gt_id int not null auto_increment,
    gt_game_id int not null,
    gt_user_game_id int not null,
    primary key (gt_id));

create table cat_condition (
    ccn_id int not null auto_increment,
    ccn_name varchar(60) not null,
    primary key (ccn_id));

create table game_team_cat_condition (
    gcc_id int not null auto_increment,
    gcc_gtc_id int not null,
    gcc_ccn_id int not null,
    gcc_duration int,
    primary key (gcc_id));

create table tile (
    tile_x int not null,
    tile_y int not null,
    tile_type_id int not null,
    tile_board_id int not null,
    primary key (tile_x, tile_y, tile_board_id));

create table tile_connection (
    tcn_origin_x int not null,
    tcn_origin_y int not null,
    tcn_origin_board_id int not null,
    tcn_target_x int not null,
    tcn_target_y int not null,
    tcn_target_board_id int not null,
    primary key (
        tcn_origin_x, tcn_origin_y, tcn_origin_board_id,
        tcn_target_x, tcn_target_y, tcn_target_board_id
    ));

# For now we only have one board;
create table board (
    brd_id int not null auto_increment,
    primary key (brd_id));

create table tile_type (
    tty_id int not null auto_increment,
    tty_type varchar(60) not null,
    primary key (tty_id));

create table placement_tile_group (
    ptg_tile_board_id int not null,
    ptg_tile_x int not null,
    ptg_tile_y int not null,
    ptg_group int not null,
    primary key (ptg_tile_board_id, ptg_tile_x, ptg_tile_y));

# Foreign Keys

# Link Game table to Game State by state id
alter table game add constraint game_fk_match_state
            foreign key (gm_state_id) references game_state(gst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link User Game to User by user id
alter table user_game add constraint user_game_fk_user
            foreign key (ug_user_id) references user(usr_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link User Game to Game by game id
alter table user_game add constraint user_game_fk_game
            foreign key (ug_game_id) references game(gm_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link User Game State to User Game by user game state id
alter table user_game add constraint user_game_fk_user_game_state
            foreign key (ug_state_id) references user_game_state(ugst_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Scoreboard to User Game by user game id
alter table scoreboard add constraint scoreboard_fk_user_game
            foreign key (sb_user_game_id) references user_game(ug_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;  

# Link Scoreboard to Scoreboard State by scoreboard state id
alter table scoreboard add constraint scoreboard_fk_scoreboard_state
            foreign key (sb_state_id) references scoreboard_state(sbs_id) 
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Team to User by tm_user_id
alter table team add constraint team_fk_user
            foreign key (tm_user_id) references user(usr_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Team Cat to Team by tmc_team_id
alter table team_cat add constraint team_cat_fk_team
            foreign key (tmc_team_id) references team(tm_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Team Cat to Cat by tmc_cat_id
alter table team_cat add constraint team_cat_fk_cat
            foreign key (tmc_cat_id) references cat(cat_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team to Game by gt_game_id
alter table game_team add constraint game_team_fk_game
        foreign key (gt_game_id) references game(gm_id)
        ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team to User by usr_id
alter table game_team add constraint game_team_fk_user
        foreign key (gt_user_game_id) references user_game(ug_id)
        ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team Cat to Cat by gtc_type_id
alter table game_team_cat add constraint game_team_cat_fk_cat
            foreign key (gtc_type_id) references cat(cat_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team Cat to Game Cat State by gtc_state_id
alter table game_team_cat add constraint game_team_cat_fk_game_team_cat_state
            foreign key (gtc_state_id) references game_cat_state(gcs_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team Cat to Game Team by gtc_game_team_id
alter table game_team_cat add constraint game_team_cat_fk_game_team
            foreign key (gtc_game_team_id) references game_team(gt_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team Cat to Board by gtc_game_board_id
alter table game_team_cat add constraint game_team_cat_fk_board
            foreign key (gtc_game_board_id) references board(brd_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team Cat to Tile by gtc_x
alter table game_team_cat add constraint game_team_cat_fk_tile_x
            foreign key (gtc_x, gtc_y) references tile(tile_x, tile_y)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Tile to Board by tile_board_id
alter table tile add constraint tile_fk_board
            foreign key (tile_board_id) references board(brd_id)
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Tile to Tile Type by tile_type_id
alter table tile add constraint tile_fk_tile_type
            foreign key (tile_type_id) references tile_type(tty_id)
			ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Tile Connection to Tile by origin
alter table tile_connection add constraint tile_connection_fk_tile_origin 
            foreign key (tcn_origin_x, tcn_origin_y, tcn_origin_board_id )
            references tile (tile_x, tile_y, tile_board_id )
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Tile Connection to Tile by target
alter table tile_connection add constraint tile_connection_fk_tile_target 
            foreign key (tcn_target_x, tcn_target_y, tcn_target_board_id )
            references tile (tile_x, tile_y, tile_board_id )
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game to Board by gm_board_id
alter table game add constraint game_fk_board
            foreign key (gm_board_id) references board(brd_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Placement Tile Group to Tile by tile_x
alter table placement_tile_group add constraint placement_tile_group_fk_tile_x_y_board_id
            foreign key (ptg_tile_x, ptg_tile_y, ptg_tile_board_id) references tile(tile_x, tile_y, tile_board_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team Cat Condition to Game Team Cat by gcc_gtc_id
alter table game_team_cat_condition add constraint game_team_cat_condition_fk_gtc_id
            foreign key (gcc_gtc_id) references game_team_cat(gtc_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;

# Link Game Team Cat Condition to Cat Condition by gcc_ccn_id
alter table game_team_cat_condition add constraint game_team_cat_condition_fk_ccn_id
            foreign key (gcc_ccn_id) references cat_condition(ccn_id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;