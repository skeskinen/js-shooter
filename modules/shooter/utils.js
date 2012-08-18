/*
 * Lots of stuff that does't fit naturally into other modules.
 * For example server time handling and small helper functions.
 */

define(["dojo/_base/array"], function(arrayUtil){
    var time_offset = 0;
    var time_results = [];

    /*
    *  Calculates standard deviation of all latency samples taken.
    *  Used to estimate server time.
    */

    function _std_deviation(times){
        var mean = 0;
        for(var i =0, len = times.length; i<len; ++i){
            mean += times[i].latency;
        }
        mean /= times.length;
        var variance = 0;
        for(var i =0, len = times.length; i<len; ++i){
            variance += Math.pow(times[i].latency,2);
        }
        variance /= times.length;
        variance -= Math.pow(mean, 2);

        return Math.sqrt(variance);
    }

    /*
    *  Calculates best guess of the server time using all latency samples taken.
    */

    function _choose_time_offset(){
        time_results.sort(function(a,b){
            return a.latency < b.latency;
        });
        var median = time_results[Math.floor(time_results.length/2)];

        var deviation = _std_deviation(time_results);

        var passing = arrayUtil.filter(time_results, function(result){
            return Math.abs(result.latency - median.latency) < (deviation +0.1);
        });

        var mean_latency = 0;
        var mean_offset = 0;
        for(var i=0, len = passing.length; i<len; ++i){
            mean_latency += passing[i].latency;
            mean_offset += passing[i].offset;

        }
        mean_latency /= passing.length;
        mean_offset /= passing.length;

        time_offset = Math.round(mean_offset + mean_latency);
    }

    /*
    *  Returns current server time approximation. On server exuals Date().getTime(). 
    */

    function time(){
        return new Date().getTime() + time_offset;
    }

    /*  
    *  Takes latency sample and adds it to existing samples. Then recalculates
    *  estimate of server-client time offset.
    */

    function new_time_result(data){
        var latency = (new Date().getTime() - data.c_time) / 2;
        var offset = data.s_time - new Date().getTime();
        time_results.push({latency: latency, offset: offset});
        _choose_time_offset();
    }

    /*  
    *  Takes 2 rectacles defined by 2 points and returns true if the rectancles overlap.
    */

    function overlap(a,b){
        return (a[2] > b[0]) && (a[0] < b[2]) && (a[3] > b[1]) && (a[1] < b[3]);
    }

    /*
     *  Takes area and vector. Checks if vector is inside area.
     */

    function inside(a, v){
        return (v.x >= a[0]) && (v.x < a[2]) && (v.y >= a[1]) && (v.y < a[3]);
    }

    /*
    *  Takes 2 functions as parameters. Returns new function that calls the first 
    *  function with original arguments and then calls other function.
    *  Return value of the first function is passed to second function as a parameter.
    *  Effectively "appends" second function to the first function or "enchants"
    *  the first function with the second function.
    *  Returns the return value of the first function.
    */

    function enchant(f, g){
        return function(){
            var ret = f.apply(this, arguments);
            g.call(this, ret);
            return ret;
        }
    }


    /*
    *  Returns new array without given object or element at index.
    *  This is done because array deletes are supposedly evil (they make array hash table).
    *  Don't use on big arrays (>50 elements).
    */
    
    function without(array, o){
        var new_array = [];
        for(var i=0, len = array.length; i<len; ++i){
            if(array[i] !== o){
                new_array.push(array[i]);
            }
        }
        return new_array;
    }

    /*
     *  See previous function.
     */

    function without_i(array, index){
        var new_array = [];
        for(var i=0, len = array.length; i<len; ++i){
            if(i !== index){
                new_array.push(array[i]);
            }
        }
        return new_array;
    }
    

    return {
        time: time,
        new_time_result: new_time_result,
        overlap: overlap,
        inside: inside,
        enchant: enchant,
        without: without,
        without_i: without_i
    }
});
