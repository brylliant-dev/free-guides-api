import React, { useEffect, useState } from "react"
import styles from "./style.css"

import PlaceAlert from "./place_alert.png"
import PlaceAddress from "./place_address.png"
import PlaceStatus from "./place_status.png"
import PlaceWebsite from "./place_website.png"
import PlacePhone from "./place_phone.png"
import PlaceArrowDown from "./place_arrow_down.png"
import PlaceStar from "./place_star.png"


const PlaceButton = (props) => {
  const  { onClick, title, theme } = props

  var style = {
    display: 'flex', 
    width: '47%', 
    height: 30, 
    borderRadius: 5, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#60BE83', 
    color: 'white', fontSize: 12, 
    fontFamily: 'Quicksand',
    fontWeight: 600
  }

  if(theme === 'light') {
    style = {...style, backgroundColor: 'white', border: '1px solid lightgray', color: 'gray'}
  }

  return (
    <div onClick={onClick} style={{...style, cursor: 'pointer'}}>{title}</div>
  )
}


/**
 *
 * @param {Place Object} place
 * @returns
 */

export const PlaceComponent = ({
  placeResultObject = {
    name: "Jiz",
    photos: [],
  },
  type = "large",
  onDelete = () => null, //mediaViewer
}) => {
  const [place, setPlace] = useState({})
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;

  useEffect(() => {
    if (window.google) {
      var service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      )

      var request = {
        placeId: placeResultObject.place_id,
        fields: [
          "name",
          "rating",
          "formatted_address",
          "formatted_phone_number",
          "utc_offset_minutes",
          "user_ratings_total",
          "opening_hours",
          "business_status",
          "photos",
          "website",
        ],
      }

      if(placeResultObject.place_id) {
        getPlace(request,service)
      } else {
        service.findPlaceFromQuery({query: placeResultObject.address, fields: ['place_id']}, (resp,status) => {
          if(status === "OK") {
            request.placeId = resp[0].place_id
            getPlace(request,service)
          }
        })
      }
    }
  }, [placeResultObject])

  const getPlace = (request,service) => {
    service.getDetails(request, (resp,status) => {
      if(status === "OK") {
        setPlace(resp)
      }
    })
  }

  const getUrlDomain = (url) => {
    const match = url.match(/^(https?:\/\/)?(www\.)?([^\/\?]+)/);
    return (match && match.length > 3) ? match[3] : url;
  }

  var day = place?.opening_hours?.periods?.length > 1 ? new Date().getDay() : 0
  const period = place.opening_hours?.periods?.filter(x => x.open.day === day)[0] ?? {
    open: null, 
    close: null
  }

  const closingTime = period.close?.time ?? false

  const closingTimeToday =
    place?.opening_hours?.weekday_text?.[new Date().getDay()] ?? false

  const openingTime = period.open?.time ?? "0000"

  return (
    <div
      id="place-component"
      className={styles.placeOverviewContainer}
      style={{ height: type === "small" ? 100 : 'auto', borderRadius: 10, backgroundColor: 'white', padding: 10, boxShadow: '1px 2px 10px lightgray' }}
    >
      {type === "medium" && place.photos && place.photos.length >= 1 && (
        <div className={styles.placePhotosContainer}>
          {place.photos.slice(0, 3).map((value, _key) => {
            var url = value.getUrl()
            return (
              <img
                key={_key}
                src={url}
                className={styles.placePhotoImg}
              />
            )
          })}
        </div>
      )}
      <p className={styles.placeName}>{place?.name ?? ""}</p>
      <div
        style={{
          marginTop: -5,
        }}
      >
        {place.opening_hours && (
          <div className={styles.fieldContainer}>
            <img
              src={placeStatus}
              className={styles.fieldIcon}
              style={{ marginTop: type === "small" ? 7 : 5 }}
            />

            <div className={styles.ratingContainer}>
              <p
                className={styles.ratingText}
                style={{
                  color: place.opening_hours.isOpen() ? "green" : "red",
                }}
              >
                {place.opening_hours.isOpen() ? "Open" : "Closed" ?? "Closed"}
              </p>

              <p
                className={styles.ratingText}
                style={{ color: "#1B2431", marginLeft: 0, marginRight: 5 }}
              >
                {place?.opening_hours?.isOpen() && closingTime && openingTime
                  ? `Closed at ${
                      closingTime === "0000"
                        ? "12:00 AM"
                        : closingTime?.slice(0, 2) + ":" + closingTime?.slice(2)
                    }`
                  : `Opens at ${
                      openingTime === "0000"
                        ? "12:00 AM"
                        : openingTime?.slice(0, 2) + ":" + openingTime?.slice(2)
                    }` ?? ""}
              </p>

              <img
                src={placeArrowDown}
                style={{
                  height: 10,
                  width: 10,
                  marginTop: type === "small" ? 10 : 5,
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        )}

        {type === 'medium' && place.website && (
          <div onClick={() => window.open(place.website)} style={{ cursor: 'pointer' }} 
            className={styles.fieldContainer}>
            <img
              src={placeWebsite}
              className={styles.fieldIcon}
            />
            <p style={{ fontSize: 12, paddingTop: 2 }} className={styles.ratingText}>{getUrlDomain(place.website)}</p>
          </div>
        )}
        {type === "medium" && place.business_status === 'CLOSED_PERMANENTLY' && (
          <div className={styles.fieldContainer} 
              style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom: 10, height: 20, backgroundColor: '#ff897e'}}>
            <p className={styles.ratingText}>Permanently Closed</p>
          </div>
        )}
        <div style={{display: 'flex', flexDirection: 'row',justifyContent: 'space-between'}}>
          <PlaceButton onClick={() => window.open("http://maps.google.com/?q=" + place.name)} title="Directions" />
          {
            //<PlaceButton theme='light' onClick={() => console.log()} title="Coupons"/>
          }
        </div>
      </div>
    </div>
  )
}
