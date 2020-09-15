import { getIcon } from "../library"

function normalizeIconArgs(icon) {
  if (icon === null) {
    return null
  }

  if (typeof icon === "object" && icon.prefix && icon.name) {
    return icon
  }

  if (Array.isArray(icon) && icon.length === 2) {
    return { prefix: icon[0], name: icon[1] }
  }

  if (typeof icon === "string") {
    return { prefix: "mdi", name: icon }
  }
}

function getMdiSizeFromClass(className) {
  switch (className) {
    case "mdi-18px":
      return 1.225
    case "mdi-24px":
      return 1.5
    case "mdi-36px":
      return 2.25
    case "mdi-48px":
      return 3
  }

  return false
}

export default {
  name: "VueMdi",
  functional: true,
  props: {
    icon: {
      type: [Object, Array, String],
    },
    title: {
      type: [Object, String],
      default: null,
    },
    description: {
      type: [Object, String],
      default: null,
    },
    size: {
      type: [Object, Number, String],
      default: null,
    },
    color: {
      type: String,
      default: "#000",
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    rotate: {
      type: Number,
      default: 0,
    },
    spin: {
      type: [Boolean, Number],
      default: false,
    },
  },
  render(createElement, { props, _v }) {
    const iconProp = normalizeIconArgs(props.icon)

    if (!iconProp) {
      throw new Error("Invalid icon property value")
    }

    const icon = getIcon(iconProp)

    if (icon) {
      const pathStyle = {}
      const transform = []
      const style = {}

      if (props.size !== null) {
        if (typeof props.size === "string") {
          const iSize = getMdiSizeFromClass(props.size)

          if (iSize) {
            style.width = `${iSize}rem`
          }
        } else {
          style.width = `${props.size * 1.5}rem`
        }

        if (style.width) {
          style["height"] = style.width
        }
      }

      if (props.horizontal) {
        transform.push("scaleX(-1)")
      }

      if (props.vertical) {
        transform.push("scaleY(-1)")
      }

      if (props.rotate !== 0) {
        transform.push(`rotate(${props.rotate}deg)`)
      }

      if (props.color !== null) {
        pathStyle.fill = props.color
      }

      const pathElement = createElement("path", {
        attrs: {
          d: icon.path,
        },
        style: pathStyle,
      })

      if (transform.length > 0) {
        style.transform = transform.join(" ")
        style.transformOrigin = "center"
      }

      let spinElement = pathElement
      const spinSec = typeof props.spin !== "number" ? 2 : props.spin
      let inverse = props.horizontal || props.vertical

      if (spinSec < 0) {
        inverse = !inverse
      }

      if (props.spin) {
        spinElement = createElement(
          "g",
          {
            style: {
              animation: `spin${inverse ? "-inverse" : ""} linear ${Math.abs(
                spinSec
              )}s infinite`,
              transformOrigin: "center",
            },
          },
          [
            pathElement,
            ...(!(props.horizontal || props.vertical || props.rotate !== 0)
              ? createElement("rect", {
                  attrs: {
                    width: 24,
                    height: 24,
                    fill: "transparent",
                  },
                })
              : []),
          ]
        )
      }

      let ariaLabelledby
      const labelledById = `icon_labelledby_${icon.id}`
      const describedById = `icon_describedby_${icon.id}`
      let role

      if (props.title) {
        ariaLabelledby = props.description
          ? `${labelledById} ${describedById}`
          : labelledById
      } else {
        role = "img"

        if (props.description) {
          throw new Error("title attribute required when description is set")
        }
      }

      return createElement(
        "svg",
        {
          attrs: {
            viewBox: "0 0 24 24",
            role,
            "aria-labelledby": ariaLabelledby,
          },
          class: "mdi-icon",
          style,
        },
        [
          ...(props.title
            ? [
                createElement(
                  "title",
                  {
                    attrs: {
                      id: labelledById,
                    },
                  },
                  _v(props.title)
                ),
              ]
            : []),
          ...(props.description
            ? [
                createElement(
                  "desc",
                  {
                    attrs: {
                      id: describedById,
                    },
                  },
                  _v(props.description)
                ),
              ]
            : []),
          spinElement,
        ]
      )
    }

    return null
  },
}
