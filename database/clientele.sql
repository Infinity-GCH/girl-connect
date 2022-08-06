create table users(
    user_id serial not null primary key,
    full_name varchar not null,
    email varchar not null,
    password varchar not null
);

create table requests(
    request_id serial not null primary key,
    user_id int,
    foreign key (user_id) references users(user_id),
    type varchar,
    description varchar,
    status varchar
);

create table chat_info(
    chat_info_id serial not null primary key,
    text varchar,
    user_id int,
    foreign key (user_id) references users(user_id),
    request_id int,
    foreign key (request_id) references requests(request_id),
    status varchar,
    date_created date,
    date_last_updated date
)

