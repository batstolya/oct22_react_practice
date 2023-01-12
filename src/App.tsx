import React, { useState } from 'react';
import './App.scss';

import classNames from 'classnames';
import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

// interface User {
//   id: number;
//   name: string;
//   sex: string;
// }

interface Product {
  id: number;
  name: string;
  categoryId: number;
}

// interface Categories {
//   id: number;
//   title: string;
//   icon: string;
//   ownerId: number;
// }

const getCategoryWithUser = categoriesFromServer.map((category) => ({
  ...category,
  user: usersFromServer.find((user) => user.id === category.ownerId),
}));

const preparedProducts = productsFromServer.map((product) => ({
  ...product,
  category: getCategoryWithUser.find(
    (category) => category.id === product.categoryId,
  ),
}));

export const App: React.FC = () => {
  const [products, setProducts] = useState(preparedProducts);
  const [selected, setSelected] = useState('all');
  const [text, setText] = useState('');

  const filterByName = (id:number) => {
    const categoryByUser = preparedProducts.filter(
      (product) => product.category?.ownerId === id,
    );

    const findSelectedUser = usersFromServer.find((user) => user.id === id);

    setSelected(findSelectedUser.id);
    setProducts(categoryByUser);
  };

  const filterByAll = () => {
    setSelected('all');
    setProducts(preparedProducts);
  };

  const handleChangText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);

    if (event.target.value === '') {
      setProducts(preparedProducts);

      return;
    }

    const LowerCaseText = text.trim().toLocaleLowerCase();

    const productName = preparedProducts.filter((product:Product) => (
      product.name.toLocaleLowerCase().includes(LowerCaseText)
    ));

    setProducts(productName);
  };

  const clearHandler = () => {
    setProducts(preparedProducts);
    setSelected('all');
    setText('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({ 'is-active': selected === 'all' })}
                onClick={filterByAll}
              >
                All
              </a>
              {usersFromServer.map((user) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={
                    classNames({ 'is-active': Number(selected) === user.id })
                  }
                  onClick={() => {
                    filterByName(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={text}
                  onChange={handleChangText}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className={classNames('delete',
                      { 'none' : text === '',
                      })}
                    onClick={clearHandler}
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const { id, name, category } = product;
                const sex
                  = category.user?.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger';

                return (
                  <tr data-cy="Product" key={id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {id}
                    </td>

                    <td data-cy="ProductName">{name}</td>
                    <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                    <td data-cy="ProductUser" className={sex}>
                      {category?.user.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
