For this puzzle we had to use specific versions of timezone databases. Good news everyone: there are available in [moment-timezone repo](https://github.com/moment/moment-timezone/tree/develop/data/packed), but bad news everyone, not all of the interesting ones (2018c and 2021b) are available there, but good news everyone, there is [grunt task](https://github.com/moment/moment-timezone/tree/develop/tasks) to download them.

In order to download the missing data files:

- Build the Docker image

  `docker build -t my-moment-tz .`

- Run the container:

  `docker run --name moment-tz-build my-moment-tz`

- Copy the data folder from the container to your host

  `docker cp moment-tz-build:/app/data ./data`

- (Optional) Remove the container:

  `docker rm moment-tz-build`
