import { useState, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../ui-components/button/Button";
import { Tag } from "../../ui-components/tag/Tag";
import { Loading } from "../../ui-components/loading/Loading";
import { useMovie } from "../../hooks/useMovie";
import { classes } from "../../common_utils/classes/classes";
import noPhoto from "../../assets/no-photo-available.png";

import styles from "./movieDetails.module.scss";

export const MovieDetails = () => {
  const [errorImg, setErrorImg] = useState(false);
  const { title = "" } = useParams();
  const navigate = useNavigate();

  const { movie, loadingMovie } = useMovie(title);

  if (loadingMovie) {
    return (
      <div>
        <div className={styles.backButtonContainer}>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
        <Loading variant="skeleton">
          <div className={styles.detailsPage}>
            <div className={styles.detailsContainerSkeleton}></div>
          </div>
        </Loading>
      </div>
    );
  }

  return (
    <div className={styles.detailsPage}>
      <div className={styles.backButtonContainer}>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.baseInfo}>
          <div className={styles.posterContainer}>
            <img
              className={classes(styles.imgMovie, {
                [styles.haveImg]: movie.Poster !== "N/A" && !errorImg,
                [styles.haveNotImg]: movie.Poster === "N/A" || errorImg,
              })}
              src={movie.Poster !== "N/A" ? movie.Poster : noPhoto}
              alt="movie_img"
              onError={(error: SyntheticEvent<HTMLImageElement, Event>) => {
                setErrorImg(true);
                error.currentTarget.src = noPhoto;
              }}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Title:</span>{" "}
              <span className={styles.itemBase}>{movie.Title}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Released:</span>{" "}
              {movie.Released}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Runtime:</span> {movie.Runtime}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Genre:</span>{" "}
              <div className={styles.genres}>
                {movie.Genre?.split(", ").map((genre) => (
                  <Tag label={genre} variant="secondary" />
                ))}
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Director:</span>{" "}
              {movie.Director}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Country:</span> {movie.Country}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Production:</span>{" "}
              {movie.Production}
            </div>
            <div className={styles.infoItem}>
              <span className={styles.itemTitle}>Metascore:</span>{" "}
              {movie.Metascore}
            </div>
            <div className={styles.rated}>
              <span className={styles.itemTitle}>Rated:</span> {movie.Rated}
            </div>
          </div>
        </div>
        <div className={styles.addInfo}>
          <div className={styles.plot}>
            <span className={styles.addInfoTitle}>Plot:</span>{" "}
            <span className={styles.addInfoItem}>{movie.Plot}</span>
          </div>

          <div className={styles.actors}>
            <span className={styles.addInfoTitle}>Actors:</span>{" "}
            <span className={styles.actorsTags}>
              {movie.Actors?.split(", ").map((actor) => (
                <Tag label={actor} variant="secondary" />
              ))}
            </span>
          </div>
          <div className={styles.actors}>
            <span className={styles.addInfoTitle}>Writer:</span>{" "}
            <span className={styles.actorsTags}>
              {movie.Writer?.split(", ").map((writer) => (
                <Tag label={writer} variant="secondary" />
              ))}
            </span>
          </div>
          <div className={styles.awards}>
            <span className={styles.addInfoTitle}>Awards:</span>{" "}
            <span className={styles.addInfoItem}>{movie.Awards}</span>
          </div>
          <div className={styles.ratings}>
            {movie.Ratings?.map((rating) => (
              <div className={styles.rating}>
                <span className={styles.addInfoTitle}>{rating.Source}:</span>{" "}
                <span className={styles.addInfoItem}>{rating.Value}</span>
              </div>
            ))}
          </div>
          <div className={styles.imdbRating}>
            <span className={styles.addInfoTitle}>IMDB Rating:</span>{" "}
            <span className={styles.addInfoItem}>{movie.imdbRating}</span>
          </div>
          <div className={styles.imdbVotes}>
            <span className={styles.addInfoTitle}>IMDB Votes:</span>{" "}
            <span className={styles.addInfoItem}>{movie.imdbVotes}</span>
          </div>
          <div className={styles.boxOffice}>
            {" "}
            <span className={styles.addInfoTitle}>Box Office:</span>{" "}
            <span className={styles.addInfoItem}>{movie.BoxOffice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
