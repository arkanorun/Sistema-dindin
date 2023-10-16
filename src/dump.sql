create database dindin

	create table usuarios (
  id serial primary key,
  nome varchar(60) not null,
  email text unique not null,
  senha text not null
  )
  
  	create table categorias (
  	id serial primary key,
    usuario_id integer references usuarios(id),
    descricao text not null
    )
    
    create table transacoes (
    id serial primary key,
    descricao text not null,
    valor integer not null,
    data text not null,
    categoria_id integer references categorias(id) not null,
		usuario_id integer references usuarios(id),
		tipo varchar(50) not null 
    )